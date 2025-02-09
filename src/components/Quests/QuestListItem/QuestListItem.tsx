import classNames from 'classnames'
import React, { useState } from 'react'

import CountdownTimer from '@components/Quests/CountdownTimer/CountdownTimer'
import { usePlayerData } from '@hooks/usePlayerData'
import { abandonQuest, completeQuest } from '@services/questService'
import { type Quest } from '@src/types/quest'

import './QuestListItem.scss'

interface QuestListItemProps {
  quest: Quest
  isOpen: boolean
  onToggle: () => void
}

const QuestListItem: React.FC<QuestListItemProps> = ({ quest, isOpen, onToggle }) => {
  const { player } = usePlayerData()

  const [loading, setLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  const { difficulty, categoryName, title, id, xp, isTimed, expiresAt } = quest

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
    if (loading || !player?.uid || (isTimed && !isExpired)) return

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
    <li className={classNames('quest-list-item', { open: isOpen })} onClick={onToggle}>
      <div className="quest-list-item__category">{categoryName}</div>

      <div className="quest-list-item__content">
        <span
          className={classNames(
            'quest-list-item__title',
            `quest-list-item__difficulty--${difficulty}`
          )}>
          {title}
        </span>
        {isTimed && expiresAt && (
          <CountdownTimer expiresAt={expiresAt} onExpire={() => setIsExpired(true)} />
        )}
        <span className="quest-list-item__xp">{xp}xp</span>
      </div>

      <div className={classNames('quest-list-item__actions', { open: isOpen })}>
        <button onClick={handleAbandon} className="quest-list-item__actions--abandon">
          Abandon
        </button>
        <button
          onClick={handleComplete}
          disabled={isTimed && !isExpired}
          className={classNames('quest-list-item__actions--validate', {
            disabled: isTimed && !isExpired,
          })}>
          Accomplir
        </button>
      </div>
    </li>
  )
}

export default QuestListItem
