import React, { useEffect, useState } from 'react'

import LevelUp from '@components/LevelUp/LevelUp'
import Loader from '@components/Loader/Loader'
import PlayerHeader from '@components/PlayerHeader/PlayerHeader'
import AddQuest from '@components/Quests/AddQuest/AddQuest'
import InProgressQuests from '@components/Quests/InProgressQuests/InProgressQuests'
import Status from '@components/Status/Status'
import { usePlayerData } from '@context/PlayerProvider'

import './Home.scss'

const Home: React.FC = () => {
  const { loading, error, levelUp } = usePlayerData()

  const [isAddingQuest, setIsAddingQuest] = useState(false)
  const [showLevelUp, setShowLevelUp] = useState(false)

  useEffect(() => {
    if (levelUp) {
      setShowLevelUp(true)
    }
  }, [levelUp])

  if (loading) return <Loader />

  if (error) return <Status type="error" message={error} />

  return (
    <section className={`home ${isAddingQuest ? 'dimmed' : ''}`}>
      <PlayerHeader />
      <section className="home__body">
        <InProgressQuests />
      </section>
      <section className="home__footer">
        <button className="primary-button" onClick={() => setIsAddingQuest(true)}>
          Nouvelle quête
        </button>
      </section>
      <div className={`quest-overlay ${isAddingQuest ? 'quest-overlay--open' : ''}`}>
        <AddQuest onClose={() => setIsAddingQuest(false)} />
      </div>
      {showLevelUp && <LevelUp onClose={() => setShowLevelUp(false)} />}
    </section>
  )
}

export default Home
