import { Link } from "react-router-dom"

import Login from "../../components/Login/Login"

import "./Auth.scss"

const Auth = () => {
  return (
    <section className="auth">
      <h2>Connexion</h2>
      <section className="auth__login">
        <Login />
      </section>
      <section className="auth__signup">
        <p>Pas encore inscrit ? <Link to="/signup">Inscris-toi ici</Link></p>
      </section>
    </section>
  )
}

export default Auth;