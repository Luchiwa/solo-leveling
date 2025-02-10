import React, { useState } from 'react'

import Loader from '@components/Loader/Loader'
import QuestListItem from '@components/Quests/QuestListItem/QuestListItem'
import Status from '@components/Status/Status'
import { useInProgressQuests } from '@hooks/useInProgressQuests'
import { usePlayerData } from '@hooks/usePlayerData'

import './InProgressQuests.scss'

const InProgressQuests: React.FC = () => {
  const { player } = usePlayerData()
  const { quests, loading, error } = useInProgressQuests(player?.uid)
  const [openedQuestId, setOpenedQuestId] = useState<string | null>(null)

  const handleToggleQuest = (questId: string) => {
    setOpenedQuestId(openedQuestId === questId ? null : questId)
  }

  if (loading) return <Loader />

  if (error) return <Status type="error" message={error} />

  return (
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
  )
}

export default InProgressQuests
