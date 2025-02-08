//src/hooks/useInProgressQuests.ts
import { useEffect, useState } from 'react'

import { listenToInProgressQuests } from '@services/questService'
import type { Quest } from '@src/types/quest'

export const useInProgressQuests = (userId?: string) => {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    const unsubscribe = listenToInProgressQuests(
      userId,
      (inProgressQuests) => {
        setQuests(inProgressQuests)
        setLoading(false)
        setError(null) // Reset de l'erreur en cas de succès
      },
      (errorMessage) => {
        setError(errorMessage)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userId])

  return { quests, loading, error }
}
