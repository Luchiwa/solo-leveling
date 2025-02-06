import React from 'react'
import { Link } from 'react-router-dom'

import Login from '@components/Login/Login'

import './Auth.scss'

const Auth: React.FC = () => {
  return (
    <section className="auth">
      <h1>Connexion</h1>
      <Login />
      <section className="auth__signup">
        <p>
          Pas encore inscrit ? <Link to="/signup">Inscris-toi ici</Link>
        </p>
      </section>
    </section>
  )
}

export default Auth
