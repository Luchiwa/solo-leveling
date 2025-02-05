import { auth } from "../firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Inscription d'un utilisateur
export const signUp = async (email: string, password: string) => {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error.message);
  }
};

// Connexion d'un utilisateur
export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Erreur lors de la connexion:", error.message);
  }
};

// Déconnexion d'un utilisateur
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error.message);
  }
};
