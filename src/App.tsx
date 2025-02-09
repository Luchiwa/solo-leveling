import React from 'react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'

import PrivateRoute from '@components/PrivateRoute/PrivateRoute'
import { AuthProvider } from '@hooks/useAuth'
import Home from '@pages/Home/Home'
import Login from '@pages/Login/Login'
import SignUp from '@pages/SignUp/SignUp'

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          {/* Route privée */}
          <Route path="/" element={<PrivateRoute element={<Home />} redirectTo="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
