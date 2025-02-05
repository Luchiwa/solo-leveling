// src/services/userService.ts
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Fonction pour ajouter un utilisateur dans Firestore
export const createUser = async (uid: string, firstName: string, email: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    await setDoc(userDocRef, {
      firstName: firstName,
      email: email,
      uid: uid,
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout de l'utilisateur", error);
  }
};

// Fonction pour récupérer un utilisateur par ID
export const getUser = async (uid: string) => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      throw new Error("Utilisateur non trouvé");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur", error);
  }
};
