import React, { useEffect } from 'react'

import { usePlayerData } from '@context/PlayerProvider'

import './LevelUp.scss'

interface LevelUpProps {
  onClose: () => void
}

const LevelUp: React.FC<LevelUpProps> = ({ onClose }) => {
  const { player } = usePlayerData()

  useEffect(() => {
    if (navigator.vibrate) {
      navigator.vibrate(200)
    }
  }, [])

  return (
    <div className="level-up">
      <div className="level-up__content">
        <h2 className="level-up__title">Niveau {player?.level} atteint !</h2>
        <p className="level-up__message">
          Félicitations, continue tes quêtes pour progresser encore plus !
        </p>
        <button onClick={onClose} className="primary-button">
          Continuer
        </button>
      </div>
    </div>
  )
}

export default LevelUp
