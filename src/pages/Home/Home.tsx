import React from 'react'
import { Link } from 'react-router-dom'

import Loader from '@components/Loader/Loader'
import PlayerHeader from '@components/PlayerHeader/PlayerHeader'
import Status from '@components/Status/Status'
import TaskList from '@components/TaskList'
import { usePlayerData } from '@hooks/usePlayerData'

import './Home.scss'

const Home: React.FC = () => {
  const { loading, error } = usePlayerData()

  if (loading) return <Loader />

  if (error) return <Status type="error" message={error} />

  return (
    <section className="home">
      <PlayerHeader />
      <TaskList />
      <section className="home__footer">
        <Link to="/add-quest">Ajoutes une quête</Link>
      </section>
    </section>
  )
}

export default Home
