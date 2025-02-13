import { useEffect, useMemo, useRef, useState } from 'react'

import { listenToQuest } from '@services/questService'
import { QUEST_STATUS } from '@src/types/quest'
import { getRemainingXP } from '@utils/levelSystem'

interface CompletedQuestData {
  questId: string
  questTitle: string
  questXp: number
  player: {
    playerName: string
    xpBefore: number
    xpAfter: number
    levelBefore: number
    levelAfter: number
    remainingXpBefore: number
    remainingXpAfter: number
  }
  category: {
    categoryName: string
    xpBefore: number
    xpAfter: number
    levelBefore: number
    levelAfter: number
    remainingXpBefore: number
    remainingXpAfter: number
  }
}

export const useCompleteQuest = (questId: string | null, playerId: string | null) => {
  const [completedQuestData, setCompletedQuestData] = useState<CompletedQuestData | null>(null)
  const [loading, setLoading] = useState(false)

  const unsubscribeRef = useRef<(() => void) | null>(null)
  const lastQuestIdRef = useRef<string | null>(null)
  const initialPlayerXP = useRef<number | null>(null)
  const initialPlayerLvl = useRef<number | null>(null)
  const initialCategoryXP = useRef<number | null>(null)
  const initialCategoryLvl = useRef<number | null>(null)

  useEffect(() => {
    if (!questId || !playerId) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
        setCompletedQuestData(null)
      }
      return
    }

    if (lastQuestIdRef.current !== questId) {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
        setCompletedQuestData(null)
      }

      setLoading(true)
      lastQuestIdRef.current = questId

      unsubscribeRef.current = listenToQuest(questId, playerId, ({ quest, category, player }) => {
        if (initialPlayerXP.current === null && player) {
          initialPlayerXP.current = player.xp
          initialPlayerLvl.current = player.level
        }

        if (initialCategoryXP.current === null && category) {
          initialCategoryXP.current = category.xp
          initialCategoryLvl.current = category.level
        }

        if (quest.status === QUEST_STATUS.COMPLETED) {
          setCompletedQuestData({
            questId,
            questTitle: quest.title,
            questXp: quest.isTimed ? quest.xp * 2 : quest.xp,
            player: {
              playerName: player.playerName,
              xpBefore: initialPlayerXP.current ?? 0,
              xpAfter: player.xp,
              levelBefore: player.level,
              levelAfter: player.level,
              remainingXpBefore: getRemainingXP(initialPlayerXP.current ?? 0, player.level),
              remainingXpAfter: getRemainingXP(player.xp, player.level),
            },
            category: {
              categoryName: category?.categoryName ?? 'Inconnue',
              xpBefore: initialCategoryXP.current ?? 0,
              xpAfter: category?.xp ?? 0,
              levelBefore: category?.level ?? 0,
              levelAfter: category?.level ?? 0,
              remainingXpBefore: getRemainingXP(
                initialCategoryXP.current ?? 0,
                category?.level ?? 0
              ),
              remainingXpAfter: getRemainingXP(category?.xp ?? 0, category?.level ?? 0),
            },
          })

          setLoading(false)
        }
      })
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current()
        unsubscribeRef.current = null
        setCompletedQuestData(null)
      }
    }
  }, [questId, playerId])

  return useMemo(() => ({ completedQuestData, loading }), [completedQuestData, loading])
}
