// Fonction pour calculer le niveau en fonction de l'XP totale
export const calculateLevel = (totalXP: number): number => {
  let level = 0
  let requiredXP = 0

  while (totalXP >= requiredXP) {
    level++
    requiredXP += level
  }

  return level - 1 // Retourne le dernier niveau atteint
}
