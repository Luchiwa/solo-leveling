import { useEffect, useState } from 'react'

import { listenToInProgressQuests } from '@services/questService'
import type { Quest } from '@src/types/quest'

export const useInProgressQuests = (userId?: string) => {
  const [quests, setQuests] = useState<Quest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    setLoading(true)
    const unsubscribe = listenToInProgressQuests(userId, (inProgressQuests) => {
      setQuests(inProgressQuests)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  return { quests, loading }
}
