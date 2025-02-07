import {
  addDoc,
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

import { getPlayer, updatePlayer } from '@services/playerService'
import { db } from '@src/firebase/firebase'
import { Quest, QUEST_STATUS, QuestDifficulty } from '@src/types/quest'

const DOC_NAME = 'quests'

export const addQuest = async (
  userId: string,
  title: string,
  category: string,
  difficulty: QuestDifficulty
) => {
  const newQuest: Quest = {
    title,
    category,
    difficulty,
    xp: difficulty, // XP = difficulté (1, 2, 3, 4)
    status: QUEST_STATUS.IN_PROGRESS,
    createdAt: Timestamp.now(),
    userId,
  }

  const questRef = await addDoc(collection(db, DOC_NAME), newQuest)
  const newQuestSnap = await getDoc(doc(db, DOC_NAME, questRef.id))

  return newQuestSnap.exists() ? { id: questRef.id, ...newQuestSnap.data() } : null
}

export const failQuest = async (questId: string) => {
  const questRef = doc(db, DOC_NAME, questId)
  await updateDoc(questRef, {
    status: QUEST_STATUS.FAILED,
    completedAt: Timestamp.now(), // On peut garder une date d'échec
  })
}

export const abandonQuest = async (questId: string) => {
  const questRef = doc(db, DOC_NAME, questId)
  await updateDoc(questRef, {
    status: QUEST_STATUS.ABANDONED,
    completedAt: Timestamp.now(), // Pour savoir quand elle a été abandonnée
  })
}

export const getInProgressQuests = async (userId: string) => {
  const questsRef = collection(db, DOC_NAME)
  const q = query(
    questsRef,
    where('userId', '==', userId),
    where('status', '==', QUEST_STATUS.IN_PROGRESS)
  )

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Quest[]
}

export const listenToInProgressQuests = (userId: string, callback: (quests: Quest[]) => void) => {
  const questsRef = collection(db, DOC_NAME)
  const q = query(
    questsRef,
    where('userId', '==', userId),
    where('status', '==', QUEST_STATUS.IN_PROGRESS)
  )

  return onSnapshot(q, (snapshot) => {
    const inProgressQuests: Quest[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Quest, 'id'>), // Cast propre pour éviter des erreurs TypeScript
    }))
    callback(inProgressQuests)
  })
}

export const completeQuest = async (questId: string, userId: string) => {
  const questRef = doc(db, DOC_NAME, questId)

  await runTransaction(db, async (transaction) => {
    // Récupérer la quête en base
    const questSnap = await transaction.get(questRef)
    if (!questSnap.exists()) {
      throw new Error("La quête n'existe pas.")
    }

    const questData = questSnap.data() as Quest
    if (questData.status !== QUEST_STATUS.IN_PROGRESS) {
      throw new Error("Cette quête n'est pas en cours.")
    }

    // Récupérer les infos du joueur
    const player = await getPlayer(userId)
    if (!player) {
      throw new Error("Le joueur n'existe pas.")
    }

    // Calculer le nouvel XP et niveau
    const newExperience = player.experience + questData.xp
    let newLevel = player.level
    let requiredXp = newLevel + 1 // XP nécessaire pour passer au niveau suivant

    while (newExperience >= requiredXp) {
      newLevel++
      requiredXp += newLevel + 1
    }

    // Mise à jour de la quête (terminée)
    transaction.update(questRef, {
      status: QUEST_STATUS.COMPLETED,
      completedAt: Timestamp.now(),
    })

    // Mise à jour du joueur (XP et potentiellement niveau)
    await updatePlayer(userId, { experience: newExperience, level: newLevel })
  })
}
