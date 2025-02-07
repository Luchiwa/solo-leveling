import { useEffect, useState } from 'react'

import { useAuth } from '@hooks/useAuth'
import { getPlayer } from '@services/playerService'
import type { Player } from '@src/types/player'

export const usePlayerData = () => {
  const { user, loading: authLoading } = useAuth()

  const [player, setPlayer] = useState<Player | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    const fetchPlayerData = async () => {
      try {
        const data = await getPlayer(user.uid)
        setPlayer(data)
      } catch (err) {
        setError('Erreur lors de la récupération des données du joueur.')
        throw err
      } finally {
        setLoading(false)
      }
    }

    fetchPlayerData()
  }, [user])

  return { player, loading: authLoading || loading, error }
}
