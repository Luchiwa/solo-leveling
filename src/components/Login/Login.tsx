import React, { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"

import { auth } from "../../firebase/firebase"

import "./Login.scss"
import InputText from "../Form/InputText"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Rediriger ou montrer un message de succès
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <InputText name="email" label="Email :" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputText name="password" label="Mot de passe :" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Se connecter</button>
      {error && <p>{error}</p>}
    </form>
  )
}

export default Login;
