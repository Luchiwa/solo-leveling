//src/hooks/usePlayerData.ts
import { useEffect, useRef, useState } from 'react'

import { useAuth } from '@hooks/useAuth'
import { listenToPlayer } from '@services/playerService'
import { calculateLevel, getNextLevelXP, getRemainingXP } from '@utils/levelSystem'

import type { Player } from '@src/types/player'

export const usePlayerData = () => {
  const { user } = useAuth()

  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [levelUp, setLevelUp] = useState<boolean>(false)

  const previousLevel = useRef<number>(0)
  const firstRender = useRef<boolean>(true) // Empêche la notification au premier chargement

  useEffect(() => {
    if (!user?.uid) return

    setLoading(true)

    const unsubscribe = listenToPlayer(
      user.uid,
      (updatedPlayer) => {
        const newLevel = calculateLevel(updatedPlayer.experience)
        if (
          !firstRender.current &&
          previousLevel.current !== null &&
          newLevel > previousLevel.current
        ) {
          setLevelUp(true)
          setTimeout(() => setLevelUp(false), 3000)
        }

        previousLevel.current = newLevel
        firstRender.current = false

        setPlayer(updatedPlayer)
        setLoading(false)
        setError(null) // Reset de l'erreur en cas de succès
      },
      (errorMessage) => {
        setError(errorMessage)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user?.uid])

  return {
    player,
    levelUp,
    nextLevelXP: player ? getNextLevelXP(player.level) : 1,
    loading,
    error,
    remainingXP: player ? getRemainingXP(player.experience, player.level) : 0,
  }
}
