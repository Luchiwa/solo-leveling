//src/services/questService.ts
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  runTransaction,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore'

import { updateCategoryXP } from '@services/categoryService'
import { getPlayer, updatePlayer } from '@services/playerService'
import { db } from '@src/firebase/firebase'
import type { Category } from '@src/types/category'
import { Player } from '@src/types/player'
import { Quest, QUEST_STATUS, QuestDifficulty, QuestDuraton } from '@src/types/quest'
import { updateXPAndLevel } from '@utils/levelSystem'

const QUESTS_DOC_NAME = 'quests'
const CATEGORIES_DOC_NAME = 'categories'
const PLAYERS_DOC_NAME = 'players'

export type InProgressQuest = Quest & { categoryName: string }

export const addQuest = async (
  userId: string,
  title: string,
  categoryName: string,
  difficulty: QuestDifficulty,
  isTimed: boolean,
  duration?: QuestDuraton
) => {
  return await runTransaction(db, async (transaction) => {
    let categoryId = null
    let expiresAt: Timestamp | undefined = undefined

    if (isTimed) {
      if (!duration || (duration.days === 0 && duration.hours === 0 && duration.minutes === 0)) {
        throw new Error('Une quête chronométrée doit avoir une durée valide (au moins 1 minute).')
      }

      const now = new Date()
      now.setDate(now.getDate() + (duration?.days || 0))
      now.setHours(now.getHours() + (duration?.hours || 0))
      now.setMinutes(now.getMinutes() + (duration?.minutes || 0))

      expiresAt = Timestamp.fromDate(now) // Conversion en Timestamp Firestore
    }

    // Vérifier si la catégorie existe déjà
    const categoriesRef = collection(db, CATEGORIES_DOC_NAME)
    const categoryQuery = query(
      categoriesRef,
      where('userId', '==', userId),
      where('categoryName', '==', categoryName)
    )
    const categorySnapshot = await getDocs(categoryQuery)

    if (!categorySnapshot.empty) {
      // La catégorie existe déjà, on récupère son ID
      categoryId = categorySnapshot.docs[0].id
    } else {
      // La catégorie n'existe pas, on la crée dans la transaction
      const newCategoryRef = doc(collection(db, CATEGORIES_DOC_NAME))
      const newCategory: Category = {
        categoryName,
        level: 0,
        xp: 0,
        userId,
        createdAt: Timestamp.now(),
      }

      transaction.set(newCategoryRef, newCategory)
      categoryId = newCategoryRef.id
    }

    // Création de la quête avec `categoryId`
    const questRef = doc(collection(db, QUESTS_DOC_NAME))
    const newQuest: Quest = {
      title,
      categoryId,
      difficulty,
      xp: difficulty, // XP = difficulté (1, 2, 3, 4)
      status: QUEST_STATUS.IN_PROGRESS,
      createdAt: Timestamp.now(),
      userId,
      isTimed,
      ...(isTimed ? { duration, expiresAt } : {}),
    }

    transaction.set(questRef, newQuest)

    return { id: questRef.id, ...newQuest }
  })
}

export const failQuest = async (questId: string) => {
  const questRef = doc(db, QUESTS_DOC_NAME, questId)
  await updateDoc(questRef, {
    status: QUEST_STATUS.FAILED,
    completedAt: Timestamp.now(), // On peut garder une date d'échec
  })
}

export const abandonQuest = async (questId: string) => {
  const questRef = doc(db, QUESTS_DOC_NAME, questId)
  await updateDoc(questRef, {
    status: QUEST_STATUS.ABANDONED,
    completedAt: Timestamp.now(), // Pour savoir quand elle a été abandonnée
  })
}

export const listenToInProgressQuests = (userId: string, callback: (quests: Quest[]) => void) => {
  const q = query(
    collection(db, QUESTS_DOC_NAME),
    where('userId', '==', userId),
    where('status', '==', QUEST_STATUS.IN_PROGRESS)
  )

  return onSnapshot(q, async (querySnapshot) => {
    const quests: Quest[] = (await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const data = doc.data() as Omit<Quest, 'id'>
        return {
          id: doc.id,
          ...data,
        }
      })
    )) as Quest[]
    callback(quests)
  })
}

export const completeQuest = async (questId: string, userId: string) => {
  const questRef = doc(db, QUESTS_DOC_NAME, questId)

  await runTransaction(db, async (transaction) => {
    const questSnap = await transaction.get(questRef)
    if (!questSnap.exists()) {
      throw new Error("La quête n'existe pas.")
    }

    const questData = questSnap.data() as Quest
    if (questData.status !== QUEST_STATUS.IN_PROGRESS) {
      throw new Error("Cette quête n'est pas en cours.")
    }

    let finalXP = questData.xp

    if (questData.isTimed) {
      finalXP *= 2
    }

    // Récupérer les infos du joueur
    const player = await getPlayer(userId)
    if (!player) {
      throw new Error("Le joueur n'existe pas.")
    }

    const { newExperience, newLevel } = updateXPAndLevel(player.xp, finalXP)

    // Mise à jour de la quête (terminée)
    transaction.update(questRef, {
      status: QUEST_STATUS.COMPLETED,
      completedAt: Timestamp.now(),
    })

    // Mise à jour du joueur (XP et potentiellement niveau)
    await updatePlayer(userId, { xp: newExperience, level: newLevel })

    if (questData.categoryId) {
      await updateCategoryXP(questData.categoryId, finalXP)
    }
  })
}

export const listenToQuest = (
  questId: string,
  playerId: string,
  callback: (data: { quest: Quest; category: Category | null; player: Player }) => void,
  onError?: (error: string) => void
) => {
  if (!questId || !playerId) return () => {}

  const questRef = doc(db, QUESTS_DOC_NAME, questId)
  const playerRef = doc(db, PLAYERS_DOC_NAME, playerId)

  let unsubscribeQuest: (() => void) | null = null
  let unsubscribePlayer: (() => void) | null = null
  let unsubscribeCategory: (() => void) | null = null

  let lastQuest: Quest | null = null
  let lastPlayer: Player | null = null
  let lastCategory: Category | null = null

  unsubscribeQuest = onSnapshot(
    questRef,
    (questSnap) => {
      if (!questSnap.exists()) {
        onError?.('La quête spécifiée n’existe pas.')
        return
      }

      const questData = questSnap.data() as Quest

      // 🛑 Si la quête est complétée, on arrête toutes les écoutes
      if (questData.status === QUEST_STATUS.COMPLETED) {
        unsubscribeQuest?.()
        unsubscribePlayer?.()
        unsubscribeCategory?.()
        callback({ quest: questData, category: lastCategory, player: lastPlayer! })
        return
      }

      lastQuest = questData

      // Lancer l'écoute du joueur en parallèle
      if (!unsubscribePlayer) {
        unsubscribePlayer = onSnapshot(
          playerRef,
          (playerSnap) => {
            if (!playerSnap.exists()) {
              onError?.('Le joueur spécifié n’existe pas.')
              return
            }

            const playerData = playerSnap.data() as Player

            // ⚡ Vérifier si les données du joueur ont réellement changé avant de mettre à jour
            if (JSON.stringify(playerData) !== JSON.stringify(lastPlayer)) {
              lastPlayer = playerData
              callback({ quest: lastQuest!, category: lastCategory, player: playerData })
            }
          },
          (error) => {
            console.error('Erreur Firestore joueur:', error)
            onError?.('Impossible de récupérer les informations du joueur.')
          }
        )
      }

      // Lancer l'écoute de la catégorie si elle existe
      if (questData.categoryId && !unsubscribeCategory) {
        const categoryRef = doc(db, CATEGORIES_DOC_NAME, questData.categoryId)
        unsubscribeCategory = onSnapshot(
          categoryRef,
          (categorySnap) => {
            if (!categorySnap.exists()) {
              onError?.('La catégorie associée n’existe pas.')
              return
            }

            const categoryData = categorySnap.data() as Category

            // ⚡ Vérifier si les données de la catégorie ont réellement changé avant de mettre à jour
            if (JSON.stringify(categoryData) !== JSON.stringify(lastCategory)) {
              lastCategory = categoryData
              callback({ quest: lastQuest!, category: categoryData, player: lastPlayer! })
            }
          },
          (error) => {
            console.error('Erreur Firestore catégorie:', error)
            onError?.('Impossible de récupérer les informations de la catégorie.')
          }
        )
      }
    },
    (error) => {
      console.error('Erreur Firestore quête:', error)
      onError?.('Impossible de récupérer les informations de la quête.')
    }
  )

  return () => {
    unsubscribeQuest?.()
    unsubscribePlayer?.()
    unsubscribeCategory?.()
  }
}
