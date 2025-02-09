import { Timestamp } from 'firebase/firestore'

export interface Category {
  categoryName: string
  level: number
  xp: number
  userId: string
  createdAt: Timestamp
}
