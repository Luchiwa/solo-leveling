//src/hooks/useInProgressQuests.ts
import { useEffect, useMemo, useState } from 'react'

import { useAuth } from '@hooks/useAuth'
import { getCategoryNameById } from '@services/categoryService'
import { InProgressQuest, listenToInProgressQuests } from '@services/questService'

export const useInProgressQuests = () => {
  const { userId } = useAuth()

  const [quests, setQuests] = useState<InProgressQuest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = listenToInProgressQuests(userId, async (fetchedQuests) => {
      try {
        // Utilisation directe de `getCategoryNameById`, qui gère déjà le cache
        const questsWithCategories = await Promise.all(
          fetchedQuests.map(async (quest) => ({
            ...quest,
            categoryName: await getCategoryNameById(quest.categoryId),
          }))
        )
        setQuests(questsWithCategories)
      } catch (err) {
        setError('Erreur lors du chargement des quêtes.')
        console.error(err)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [userId])

  return useMemo(() => ({ quests, loading, error }), [quests, loading, error])
}
