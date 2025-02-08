//src/utils/levelSystem.ts

// Fonction pour calculer le niveau en fonction de l'XP totale
export const calculateLevel = (totalXP: number): number => {
  let level = 0
  let requiredXP = 1
  let accumulatedXP = 0

  while (totalXP >= accumulatedXP + requiredXP) {
    accumulatedXP += requiredXP
    level++
    requiredXP = level + 1
  }

  return level
}

// Fonction pour obtenir l'XP requise pour le prochain niveau
export const getNextLevelXP = (currentLevel: number): number => {
  return currentLevel + 1
}

export const updateXPAndLevel = (currentXP: number, questXP: number) => {
  const newExperience = currentXP + questXP
  const newLevel = calculateLevel(newExperience)

  return { newExperience, newLevel }
}

// Fonction pour calculer l'XP restante avant le prochain niveau
export const getRemainingXP = (totalXP: number, currentLevel: number): number => {
  const nextLevelXP = getNextLevelXP(currentLevel) // XP requise pour le prochain niveau
  const accumulatedXP = (currentLevel * (currentLevel + 1)) / 2 // XP déjà requise pour atteindre le niveau actuel
  return nextLevelXP - (totalXP - accumulatedXP)
}
