// src/components/Login.tsx
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Rediriger ou montrer un message de succès
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Se connecter</button>
      {error && <p>{error}</p>}
    </form>
  );
};

export default Login;
