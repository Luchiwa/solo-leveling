import React, { useEffect, useState } from 'react'

import './QuestCompletionModal.scss'

interface QuestCompletionModalProps {
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
  onClose: () => void
}

const QuestCompletionModal: React.FC<QuestCompletionModalProps> = ({
  questTitle,
  questXp,
  player,
  category,
  onClose,
}) => {
  const getProgress = (level: number, xp: number) => ((level + 1 - xp) / (level + 1)) * 100

  const progress = {
    player: {
      initial: getProgress(player.levelBefore, player.remainingXpBefore),
      mid: getProgress(player.levelBefore, player.remainingXpBefore - questXp),
      final: getProgress(player.levelAfter, player.remainingXpAfter),
    },
    category: {
      initial: getProgress(category.levelBefore, category.remainingXpBefore),
      mid: getProgress(category.levelBefore, category.remainingXpBefore - questXp),
      final: getProgress(category.levelAfter, category.remainingXpAfter),
    },
  }

  const [animatedPlayerXP, setAnimatedPlayerXP] = useState(progress.player.initial)
  const [animatedCategoryXP, setAnimatedCategoryXP] = useState(progress.category.initial)

  const [levelPlayer, setLevelPlayer] = useState(player.levelBefore)
  const [levelCategory, setLevelCategory] = useState(category.levelBefore)

  const [startProgressCategory, setStartProgressCategory] = useState(false)
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setAnimatedPlayerXP(progress.player.mid)

      if (player.levelAfter > player.levelBefore) {
        setTimeout(() => {
          setLevelPlayer(player.levelAfter)
          setAnimatedPlayerXP(progress.player.final)
          setTimeout(() => setStartProgressCategory(true), 800)
        }, 1000)
      } else {
        setTimeout(() => setStartProgressCategory(true), 800)
      }
    }, 500)
  }, [])

  useEffect(() => {
    if (startProgressCategory) {
      setTimeout(() => {
        setAnimatedCategoryXP(progress.category.mid)

        if (category.levelAfter > category.levelBefore) {
          setTimeout(() => {
            setLevelCategory(category.levelAfter)
            setAnimatedCategoryXP(progress.category.final)
          }, 1000)
        }
      }, 500)
    }
  }, [startProgressCategory])

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      onClose() // Exécute la fermeture après l'animation
    }, 300) // Durée de l'animation (match le CSS)
  }

  return (
    <div className={`quest-completion-modal ${isClosing ? 'closing' : ''}`}>
      <div className="quest-completion-modal__content">
        <h2 className="quest-completion-modal__title">{questTitle}</h2>
        <p className="quest-completion-modal__status">Terminé ! 🎉</p>

        {/* Progression Joueur */}
        <div className="progress-section">
          <div className="progress-section__info">
            <h3>{player.playerName}</h3>
            <span>Niveau {levelPlayer}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${animatedPlayerXP}%` }} />
          </div>
        </div>

        {/* Progression Catégorie */}
        <div className="progress-section">
          <div className="progress-section__info">
            <h3>{category.categoryName}</h3>
            <span>Niveau {levelCategory}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-bar__fill" style={{ width: `${animatedCategoryXP}%` }} />
          </div>
        </div>

        <button className="primary-button" onClick={handleClose}>
          Fermer
        </button>
      </div>
    </div>
  )
}

export default QuestCompletionModal
