//src/services/questService.ts
import {
  collection,
  doc,
  getDoc,
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
import { Quest, QUEST_STATUS, QuestDifficulty, QuestDuraton } from '@src/types/quest'
import { updateXPAndLevel } from '@utils/levelSystem'

const QUESTS_DOC_NAME = 'quests'
const CATEGORIES_DOC_NAME = 'categories'
const CACHE_EXPIRATION_TIME = 5 * 60 * 1000 // 5 minutes en millisecondes

const categoryCache = new Map<string, string>()
const cacheTimestamps = new Map<string, number>()

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

export const listenToInProgressQuests = (
  userId: string,
  // eslint-disable-next-line no-unused-vars
  callback: (quests: Quest[]) => void,
  // eslint-disable-next-line no-unused-vars
  onError?: (error: string) => void
) => {
  const questsRef = collection(db, QUESTS_DOC_NAME)
  const q = query(
    questsRef,
    where('userId', '==', userId),
    where('status', '==', QUEST_STATUS.IN_PROGRESS)
  )

  return onSnapshot(
    q,
    async (snapshot) => {
      const currentTime = Date.now()

      const inProgressQuests = await Promise.all(
        snapshot.docs.map(async (docSnapshot) => {
          const quest = { id: docSnapshot.id, ...(docSnapshot.data() as Omit<Quest, 'id'>) }

          let categoryName = ''
          if (quest.categoryId) {
            // Vérifier si la catégorie est en cache ET si elle est encore valide
            if (
              categoryCache.has(quest.categoryId) &&
              cacheTimestamps.has(quest.categoryId) &&
              currentTime - (cacheTimestamps.get(quest.categoryId) || 0) < CACHE_EXPIRATION_TIME
            ) {
              categoryName = categoryCache.get(quest.categoryId) as string
            } else {
              // La catégorie doit être rechargée depuis Firestore
              const categoryRef = doc(db, CATEGORIES_DOC_NAME, quest.categoryId)
              const categorySnap = await getDoc(categoryRef)

              if (categorySnap.exists()) {
                categoryName = categorySnap.data().categoryName
                categoryCache.set(quest.categoryId, categoryName) // Mettre à jour le cache
                cacheTimestamps.set(quest.categoryId, currentTime) // Mettre à jour le timestamp
              }
            }
          }

          return { ...quest, categoryName }
        })
      )

      callback(inProgressQuests)
    },
    (error) => {
      console.error('Erreur Firestore:', error)
      onError?.('Impossible de récupérer les quêtes en cours.')
    }
  )
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

    const { newExperience, newLevel } = updateXPAndLevel(player.experience, finalXP)

    // Mise à jour de la quête (terminée)
    transaction.update(questRef, {
      status: QUEST_STATUS.COMPLETED,
      completedAt: Timestamp.now(),
    })

    // Mise à jour du joueur (XP et potentiellement niveau)
    await updatePlayer(userId, { experience: newExperience, level: newLevel })

    if (questData.categoryId) {
      await updateCategoryXP(questData.categoryId, finalXP)
    }
  })
}
