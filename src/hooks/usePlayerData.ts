import { useEffect, useState } from 'react'

import { useAuth } from '@hooks/useAuth'
import { getPlayer } from '@services/playerService'

interface Player {
  playerName: string
  email: string
  level: number
  uid: string
}

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
        console.log(err)
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
