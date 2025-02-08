//src/services/categoryService.ts
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  Timestamp,
  where,
} from 'firebase/firestore'

import { db } from '@src/firebase/firebase'
import { Category } from '@src/types/category'
import { calculateLevel } from '@utils/levelSystem'

const CATEGORIES_DOC_NAME = 'categories'

export const addCategory = async (userId: string, categoryName: string) => {
  const newCategory: Category = {
    categoryName,
    level: 0,
    xp: 0,
    userId,
    createdAt: Timestamp.now(),
  }

  await addDoc(collection(db, CATEGORIES_DOC_NAME), newCategory)
}

export const getUserCategories = async (userId: string): Promise<Category[]> => {
  const categoriesRef = collection(db, CATEGORIES_DOC_NAME)
  const q = query(categoriesRef, where('userId', '==', userId))

  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Category, 'id'>
    return { id: doc.id, ...data }
  }) as Category[]
}

export const updateCategoryXP = async (categoryId: string, xpGained: number) => {
  const categoryRef = doc(db, CATEGORIES_DOC_NAME, categoryId)

  await runTransaction(db, async (transaction) => {
    const categorySnap = await transaction.get(categoryRef)
    if (!categorySnap.exists()) {
      throw new Error("La catégorie n'existe pas.")
    }

    const categoryData = categorySnap.data()
    const newExperience = categoryData.xp + xpGained
    const newLevel = calculateLevel(newExperience) // 🔥 Même système de niveau que le joueur

    transaction.update(categoryRef, { xp: newExperience, level: newLevel })
  })
}
