import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import InputText from '@components/Form/InputText'
import Loader from '@components/Loader/Loader'
import Status from '@components/Status/Status'
import { getFirebaseErrorMessage } from '@src/firebase/firebaseErrors'
import { register } from '@src/services/authService'

import './SignUp.scss'

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [playerName, setPlayerName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await register(email, password, playerName)
      if (user) {
        navigate('/')
      }
    } catch (err) {
      const firebaseErrorCode = (err as any).code || 'unknown'
      setError(getFirebaseErrorMessage(firebaseErrorCode))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="signup">
      <h1>Inscription</h1>
      <form className="signup__form" onSubmit={handleSubmit}>
        {error && <Status type="error" message={error} />}
        <InputText
          name="playerName"
          label="Nom du joueur"
          value={playerName}
          onChange={(e) => setPlayerName((e.target as HTMLInputElement).value)}
        />
        <InputText
          name="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        />
        <InputText
          name="password"
          label="Mot de passe"
          type="password"
          value={password}
          onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        />
        {loading ? (
          <Loader />
        ) : (
          <button className="primary-button" type="submit">
            Envoyer
          </button>
        )}
      </form>
      <Link to="/">Connectes-toi ici</Link>
    </section>
  )
}

export default SignUp
