import classNames from 'classnames'
import React, { useState } from 'react'

import { usePlayerData } from '@hooks/usePlayerData'
import { abandonQuest, completeQuest } from '@services/questService'
import { QUEST_DIFFICULTY, type Quest } from '@src/types/quest'

import './QuestListItem.scss'

interface QuestListItemProps {
  quest: Quest
}

const QuestListItem: React.FC<QuestListItemProps> = ({ quest }) => {
  const { difficulty, category, title, id } = quest

  const { player } = usePlayerData()

  const [loading, setLoading] = useState(false)

  const handleAbandon = async () => {
    if (loading) return
    setLoading(true)

    try {
      if (id) {
        await abandonQuest(id)
      } else {
        console.error('Quest ID is undefined')
      }
    } catch (error) {
      console.error('Erreur lors de l’abandon de la quête:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async () => {
    if (loading || !player?.uid) return
    setLoading(true)

    try {
      if (id) {
        await completeQuest(id, player.uid)
      } else {
        console.error('Quest ID is undefined')
      }
    } catch (error) {
      console.error('Erreur lors de la validation de la quête:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <li className="quest-list-item">
      <div
        className={classNames('quest-list-item__difficulty', {
          'quest-list-item__difficulty--easy': difficulty === QUEST_DIFFICULTY.EASY,
          'quest-list-item__difficulty--medium': difficulty === QUEST_DIFFICULTY.MEDIUM,
          'quest-list-item__difficulty--difficult': difficulty === QUEST_DIFFICULTY.DIFFICULT,
          'quest-list-item__difficulty--hard': difficulty === QUEST_DIFFICULTY.HARD,
        })}></div>
      <div className="quest-list-item__data">
        <span className="quest-list-item__data--category">{category}</span>
        <span className="quest-list-item__data--title">{title}</span>
      </div>
      <div className="quest-list-item__tools">
        <button onClick={handleAbandon} className="quest-list-item__tools--abandon">
          Abandonner
        </button>
        <button onClick={handleComplete} className="quest-list-item__tools--validate">
          Valider
        </button>
      </div>
    </li>
  )
}

export default QuestListItem
