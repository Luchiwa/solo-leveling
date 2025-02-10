import classNames from 'classnames'
import React, { useEffect, useState } from 'react'

import { usePlayerData } from '@hooks/usePlayerData'
import { logout } from '@services/authService'

import './PlayerHeader.scss'

const PlayerHeader: React.FC = () => {
  const { player, levelUp, remainingXP, nextLevelXP } = usePlayerData()

  const [openedHeader, setOpenedHeader] = useState(false)
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const progress = player ? ((nextLevelXP - remainingXP) / nextLevelXP) * 100 : 0
  const isMaxed = animatedProgress >= 100

  const handleOpenHeader = () => {
    setOpenedHeader(!openedHeader)
  }
  const handleLogout = async () => {
    await logout()
  }

  useEffect(() => {
    if (levelUp) {
      setAnimatedProgress(100) // Simule une montée progressive à 100%

      setTimeout(() => {
        setAnimatedProgress(progress) // Redescend doucement après level-up
      }, 1000) // Attendre avant de reset
    } else {
      setAnimatedProgress(progress)
    }
  }, [progress, levelUp])

  if (!player) return null

  const { level, playerName, experience } = player

  return (
    <header className="player-header" onClick={handleOpenHeader}>
      <section className="player-header__content">
        <section className="player-header__player">
          <div className="player-header__player--name">{playerName}</div>
          <div className="player-header__player--lvl">
            <span>Lvl</span>
            <strong>{level}</strong>
          </div>
        </section>
        <section
          className={classNames('player-header__more', {
            'player-header__more--open': openedHeader,
          })}>
          <section className="player-header__more--data">
            <span>
              Lvl {level + 1} : {remainingXP}xp
            </span>
            <span>{experience}xp</span>
          </section>
          <section className="player-header__more--settings">
            <button className="primary-button" onClick={handleLogout}>
              Se déconnecter
            </button>
          </section>
        </section>
      </section>
      <div className="player-header__progress-bar">
        <div
          className={classNames('player-header__progress-bar--fill', {
            'player-header__progress-bar--maxed': isMaxed,
          })}
          style={{ width: `${animatedProgress}%` }}></div>
      </div>
    </header>
  )
}

export default PlayerHeader
