import { Timestamp } from 'firebase/firestore'

export const QUEST_STATUS = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ABANDONED: 'abandoned',
  FAILED: 'failed',
} as const

export type QuestStatus = (typeof QUEST_STATUS)[keyof typeof QUEST_STATUS]

export const QUEST_DIFFICULTY = {
  UNSET: 0,
  EASY: 1,
  MEDIUM: 2,
  DIFFICULT: 3,
  HARD: 4,
} as const

export type QuestDifficulty = (typeof QUEST_DIFFICULTY)[keyof typeof QUEST_DIFFICULTY]

export interface QuestDuraton {
  days: number
  hours: number
  minutes: number
}
export interface Quest {
  id?: string
  title: string
  categoryId: string
  difficulty: QuestDifficulty
  xp: number
  status: QuestStatus
  createdAt: Timestamp
  completedAt?: Timestamp
  userId: string
  isTimed?: boolean
  duration?: QuestDuraton
  expiresAt?: Timestamp
}
