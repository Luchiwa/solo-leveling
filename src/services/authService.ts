import { createUserWithEmailAndPassword, deleteUser, signOut } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'

import { auth, db } from '@src/firebase/firebase'

export const register = async (email: string, password: string, nickName: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user
  try {
    await setDoc(doc(db, 'users', user.uid), {
      nickName: nickName,
      email: email,
      uid: user.uid,
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
