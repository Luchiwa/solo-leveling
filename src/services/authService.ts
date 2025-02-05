import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const register = async (email: string, password: string, firstName: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Ajout du prénom de l'utilisateur dans Firestore
    await setDoc(doc(db, "users", user.uid), {
      firstName: firstName,
      email: email,
      uid: user.uid,
    });

    return userCredential;
  } catch (error) {
    throw new Error(`Erreur lors de l'inscription: ${(error as any).message}`);
  }
};

// Connexion d'un utilisateur
export const login = async (email: string, password: string) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw new Error(`Erreur lors de la connexion: ${(error as any).message}`);
  }
};

// Déconnexion d'un utilisateur
export const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(`Erreur lors de la déconnexion: ${(error as any).message}`);
  }
};
