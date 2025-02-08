import React from 'react'

import Loader from '@components/Loader/Loader'
import QuestListItem from '@components/QuestListItem/QuestListItem'
import Status from '@components/Status/Status'
import { useInProgressQuests } from '@hooks/useInProgressQuests'
import { usePlayerData } from '@hooks/usePlayerData'

import './InProgressQuests.scss'

const InProgressQuests: React.FC = () => {
  const { player } = usePlayerData()
  const { quests, loading, error } = useInProgressQuests(player?.uid)

  if (loading) return <Loader />

  if (error) return <Status type="error" message={error} />

  return (
    <section className="in-progress-quests">
      <h2>Quêtes en cours:</h2>
      {quests.length > 0 ? (
        <ul className="in-progress-quests__list">
          {quests.map((quest) => (
            <QuestListItem key={quest.id} quest={quest} />
          ))}
        </ul>
      ) : (
        <p>Aucune quête en cours.</p>
      )}
    </section>
  )
}

export default InProgressQuests
