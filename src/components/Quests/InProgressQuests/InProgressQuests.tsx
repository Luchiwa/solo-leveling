import React, { useState } from 'react'

import Loader from '@components/Loader/Loader'
import QuestCompletionModal from '@components/Quests/QuestCompletionModal/QuestCompletionModal'
import QuestListItem from '@components/Quests/QuestListItem/QuestListItem'
import Status from '@components/Status/Status'
import { usePlayerData } from '@context/PlayerProvider'
import { useInProgressQuests } from '@hooks/useInProgressQuests'
import { useCompleteQuest } from '@src/hooks/useCompleteQuest'

import './InProgressQuests.scss'

const InProgressQuests: React.FC = () => {
  const { player } = usePlayerData()
  const { quests, loading, error } = useInProgressQuests()

  const [openedQuestId, setOpenedQuestId] = useState<string | null>(null)
  const [completedQuestId, setCompletedQuestId] = useState<string | null>(null)

  const { completedQuestData } = useCompleteQuest(completedQuestId, player?.uid ?? null)

  const handleToggleQuest = (questId: string) => {
    setOpenedQuestId((prev) => (prev === questId ? null : questId))
    if (questId !== completedQuestId) {
      setCompletedQuestId(questId)
    }
  }

  const handleCloseCompletionModal = () => {
    setTimeout(() => {
      setCompletedQuestId(null)
    }, 300)
  }

  if (loading) return <Loader />

  if (error) return <Status type="error" message={error} />

  return (
    <>
      <section className="in-progress-quests">
        <h2>
          {quests.length > 0
            ? `${quests.length > 1 ? `${quests.length} Quêtes` : 'Quête'} en cours`
            : 'Aucune quête en cours'}
        </h2>
        {quests.length > 0 && (
          <ul className="in-progress-quests__list">
            {quests.map((quest) => (
              <QuestListItem
                key={quest.id}
                quest={quest}
                isOpen={openedQuestId === quest.id}
                onToggle={() => quest.id && handleToggleQuest(quest.id)}
              />
            ))}
          </ul>
        )}
      </section>
      {completedQuestData && (
        <QuestCompletionModal {...completedQuestData} onClose={handleCloseCompletionModal} />
      )}
    </>
  )
}

export default InProgressQuests
