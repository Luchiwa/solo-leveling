import { addDoc, collection, Timestamp } from 'firebase/firestore'

import { db } from '@src/firebase/firebase'

const DOC_NAME = 'quests'

export interface Quest {
  title: string
  category: string
  difficulty: number // 1 = Facile, 2 = Moyen, 3 = Difficile, 4 = Très Difficile
  xp: number
  createdAt: Timestamp
  userId: string
}

export const addQuest = async (
  userId: string,
  title: string,
  category: string,
  difficulty: number
) => {
  const newQuest: Quest = {
    title,
    category,
    difficulty,
    xp: difficulty, // XP = difficulté (1, 2, 3, 4)
    createdAt: Timestamp.now(),
    userId,
  }

  await addDoc(collection(db, DOC_NAME), newQuest)
}
