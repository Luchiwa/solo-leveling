import React from 'react'

import TaskList from '@components/TaskList'
import { useAuth } from '@hooks/useAuth'
import { logout } from '@src/services/authService'

const Home: React.FC = () => {
  const { user, loading } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  if (loading) return <p>Chargement en cours...</p>

  return (
    <div>
      <h1>Bienvenue sur Solo Leveling </h1>
      <p>Bienvenue, {user.email}</p>
      <TaskList />
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  )
}

export default Home
