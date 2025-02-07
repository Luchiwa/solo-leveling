import { createUserWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth'

import { createPlayer } from '@services/playerService'
import { auth } from '@src/firebase/firebase'

export const register = async (email: string, password: string, playerName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  try {
    await createPlayer({
      playerName,
      email,
      uid: user.uid,
      level: 0,
      experience: 0,
    })
  } catch (error) {
    // Si l'ajout à Firestore échoue, on supprime l'utilisateur créé
    await deleteUser(user)
    throw error
  }
  return userCredential
}

export const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    throw new Error(`Erreur lors de la déconnexion: ${(error as any).message}`)
  }
}
