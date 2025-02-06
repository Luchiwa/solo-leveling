import classNames from 'classnames'
import React, { useState } from 'react'

import { usePlayerData } from '@hooks/usePlayerData'
import { logout } from '@services/authService'

import './PlayerHeader.scss'

const PlayerHeader: React.FC = () => {
  const { player } = usePlayerData()

  const [openSettings, setOpenSettings] = useState(false)

  const handleOpenSettings = () => {
    setOpenSettings(!openSettings)
  }
  const handleLogout = async () => {
    await logout()
  }

  return (
    <header className="player-header" onClick={handleOpenSettings}>
      <section className="player-header__player">
        <div className="player-header__player--name">{player?.playerName}</div>
        <div className="player-header__player--lvl">
          <span>Lvl</span>
          <strong>{player?.level}</strong>
        </div>
      </section>
      <section
        className={classNames('player-header__settings', {
          'player-header__settings--open': openSettings,
        })}>
        <button className="player-header__settings--logout primary-button" onClick={handleLogout}>
          Se déconnecter
        </button>
      </section>
    </header>
  )
}

export default PlayerHeader
