import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import { useAuth } from "./hooks/useAuth"

import Home from "./pages/Home"
import Auth from "./pages/Auth/Auth"
import SignUp from "./pages/SignUp"

function App() {
  const { user, loading } = useAuth()

  if (loading) return <p>Chargement en cours...</p>

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
