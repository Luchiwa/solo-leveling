import { signInWithEmailAndPassword } from 'firebase/auth'
import React, { useState } from 'react'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // TODO: Rediriger ou montrer un message de succès
    } catch (err) {
      if (err instanceof Error) {
        // Extraire le code d'erreur et afficher un message personnalisé
        const firebaseErrorCode = (err as any).code || 'unknown'
        setError(getFirebaseErrorMessage(firebaseErrorCode))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      {error && <Status type="error" message={error} />}
      <InputText
        name="email"
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputText
        name="password"
        label="Mot de passe"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {loading ? (
        <Loader />
      ) : (
        <button className="primary-button" type="submit">
          Envoyer
        </button>
      )}
    </form>
  )
}

export default Login
