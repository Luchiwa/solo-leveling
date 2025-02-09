import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import InProgressQuests from '@components/InProgressQuests/InProgressQuests'
import LevelUp from '@components/LevelUp/LevelUp'
import Loader from '@components/Loader/Loader'
import PlayerHeader from '@components/PlayerHeader/PlayerHeader'
import Status from '@components/Status/Status'
import { usePlayerData } from '@hooks/usePlayerData'

import './Home.scss'

const Home: React.FC = () => {
  const { loading, error, levelUp } = usePlayerData()

  const [showLevelUp, setShowLevelUp] = useState(false)

  useEffect(() => {
    if (levelUp) {
      setShowLevelUp(true)
    }
  }, [levelUp])

  if (loading) return <Loader />

  if (error) return <Status type="error" message={error} />

  return (
    <section className="home">
      <PlayerHeader />
      <section className="home__body">
        <InProgressQuests />
      </section>
      <section className="home__footer">
        <Link className="primary-link" to="/add-quest">
          Nouvelle quête
        </Link>
      </section>
      {showLevelUp && <LevelUp onClose={() => setShowLevelUp(false)} />}
    </section>
  )
}

export default Home
