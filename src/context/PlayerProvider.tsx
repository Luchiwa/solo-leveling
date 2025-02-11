import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { useAuth } from '@hooks/useAuth'
import { listenToPlayer } from '@services/playerService'
import { calculateLevel, getNextLevelXP, getRemainingXP } from '@utils/levelSystem'

import type { Player } from '@src/types/player'

// Cache global pour éviter les re-fetchs Firestore
const playerCache = new Map<string, Player>()

interface PlayerContextType {
  player: Player | null
  loading: boolean
  error: string | null
  levelUp: boolean
  nextLevelXP: number
  remainingXP: number
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined)

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userId } = useAuth()

  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [levelUp, setLevelUp] = useState<boolean>(false)

  const previousLevel = useRef<number | null>(null)
  const firstRender = useRef<boolean>(true)

  useEffect(() => {
    if (!userId) {
      setPlayer(null)
      setLoading(false)
      return
    }

    setLoading(true)

    // Charger le joueur depuis le cache si dispo
    if (playerCache.has(userId)) {
      setPlayer(playerCache.get(userId) || null)
      setLoading(false)
    }

    const unsubscribe = listenToPlayer(
      userId,
      (updatedPlayer) => {
        if (!updatedPlayer) {
          setError('Player data is null')
          setLoading(false)
          return
        }

        const newLevel = calculateLevel(updatedPlayer.xp)

        // Détection de la montée de niveau
        if (previousLevel.current !== null && newLevel > previousLevel.current) {
          setLevelUp(true)
          setTimeout(() => setLevelUp(false), 3000)
        }

        previousLevel.current = newLevel
        firstRender.current = false

        // Met à jour le cache global
        playerCache.set(userId, updatedPlayer)

        setPlayer({ ...updatedPlayer })
        setLoading(false)
        setError(null)
      },
      (errorMessage) => {
        setError(errorMessage)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  return (
    <PlayerContext.Provider
      value={{
        player,
        loading,
        error,
        levelUp,
        nextLevelXP: player ? getNextLevelXP(player.level) : 1,
        remainingXP: player ? getRemainingXP(player.xp, player.level) : 0,
      }}>
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayerData = () => {
  const context = useContext(PlayerContext)
  if (!context) {
    throw new Error('usePlayerData must be used within a PlayerProvider')
  }
  return context
}
