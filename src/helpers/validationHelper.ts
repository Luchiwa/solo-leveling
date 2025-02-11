import { QuestDifficulty, QuestDuraton } from '@src/types/quest'

type ValidationResult = { valid: boolean; error: string }

const createValidationResult = (error: string): ValidationResult => ({
  valid: !error,
  error,
})

export const validateEmail = (email: string): ValidationResult => {
  if (!email.trim()) return createValidationResult('Email requis')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return createValidationResult('Format email invalide')

  return createValidationResult('')
}

export const validatePassword = (password: string): ValidationResult => {
  if (!password.trim()) return createValidationResult('Mot de passe requis')
  if (password.length < 6)
    return createValidationResult('Mot de passe trop court (min. 6 caractères)')

  return createValidationResult('')
}

export const validatePlayerName = (playerName: string): ValidationResult => {
  if (!playerName.trim()) return createValidationResult('Nom du joueur requis')

  return createValidationResult('')
}

export const validateQuestTitle = (title: string): ValidationResult => {
  if (!title.trim()) return createValidationResult('Titre requis')

  return createValidationResult('')
}

export const validateQuestCategory = (category: string): ValidationResult => {
  if (!category.trim()) return createValidationResult('Catégorie requise')

  return createValidationResult('')
}

export const validateQuestDifficulty = (difficulty: QuestDifficulty): ValidationResult => {
  if (difficulty === 0) return createValidationResult('Difficulté requise')

  return createValidationResult('')
}

export const validateTimedQuest = (isTimed: boolean, duration: QuestDuraton): ValidationResult => {
  if (isTimed && duration.days === 0 && duration.hours === 0 && duration.minutes === 0)
    return createValidationResult('Une quête chronométrée doit durer au moins 1 minute.')
  return createValidationResult('')
}
