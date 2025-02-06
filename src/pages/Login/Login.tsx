import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import InputText from '@components/Form/InputText'
import Loader from '@components/Loader/Loader'
import Status from '@components/Status/Status'
import { auth } from '@src/firebase/firebase'
import { getFirebaseErrorMessage } from '@src/firebase/firebaseErrors'

import './Login.scss'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password)
      if (user) {
        navigate('/')
      }
    } catch (err) {
      if (err instanceof Error) {
        const firebaseErrorCode = (err as any).code || 'unknown'
        setError(getFirebaseErrorMessage(firebaseErrorCode))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="login">
      <h1>Connexion</h1>
      <form className="login__form" onSubmit={handleSubmit}>
        {error && <Status type="error" message={error} />}
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
      <p>
        Pas encore inscrit ? <Link to="/signup">Inscris-toi ici</Link>
      </p>
    </section>
  )
}

export default Login
