import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import { useAuth } from '@hooks/useAuth'
import Auth from '@pages/Auth/Auth'
import Home from '@pages/Home'
import SignUp from '@src/pages/SignUp/SignUp'

const App: React.FC = () => {
  const { user } = useAuth()

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Home /> : <Auth />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  )
}

export default App
