import Home from "./pages/Home"

import { useAuth } from "./hooks/useAuth"
import Auth from "./pages/Auth"

function App() {
  const { user, loading } = useAuth()

  if (loading) return <p>Chargement en cours...</p>

  console.log(user)
  console.log(loading)
  return (
    <>
      {user ? (
        <Home />
      ) : (
        <Auth />
      )}
    </>
  )
}

export default App;
