import classNames from 'classnames'
import React, { useState } from 'react'

import ConfirmationModal from '@components/ConfirmationModal/ConfirmationModal'
import CountdownTimer from '@components/Quests/CountdownTimer/CountdownTimer'
import { usePlayerData } from '@context/PlayerProvider'
import { abandonQuest, completeQuest, InProgressQuest } from '@services/questService'

import './QuestListItem.scss'

interface QuestListItemProps {
  quest: InProgressQuest
  isOpen: boolean
  onToggle: () => void
}

const QuestListItem: React.FC<QuestListItemProps> = ({ quest, isOpen, onToggle }) => {
  const { player } = usePlayerData()

  const [loading, setLoading] = useState(false)
  const [isExpired, setIsExpired] = useState(false)
  const [isAbandonModalOpen, setIsAbandonModalOpen] = useState(false)

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
      setIsAbandonModalOpen(false)
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
    <>
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
          <button
            type="button"
            onClick={() => setIsAbandonModalOpen(true)}
            className="quest-list-item__actions--abandon primary-button">
            Échouer
          </button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={isTimed && !isExpired}
            className={classNames('quest-list-item__actions--validate primary-button', {
              disabled: isTimed && !isExpired,
            })}>
            Terminer
          </button>
        </div>
      </li>
      {isAbandonModalOpen && (
        <ConfirmationModal
          title="Abandonner la quête ?"
          message="Cette action est irréversible."
          onCancel={() => setIsAbandonModalOpen(false)}
          onConfirm={handleAbandon}
        />
      )}
    </>
  )
}

export default QuestListItem
