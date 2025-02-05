import { db } from "../firebase";
import { collection, addDoc, getDocs, updateDoc, doc, setDoc, getDoc } from "firebase/firestore";

// Fonction pour récupérer toutes les tâches
export const getTasks = async () => {
  const querySnapshot = await getDocs(collection(db, "tasks"));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fonction pour ajouter une nouvelle tâche
export const addTask = async (title: string, xp: number, category: string) => {
  await addDoc(collection(db, "tasks"), {
    title,
    xp,
    category,
    completed: false,
  });
};

// Fonction pour marquer une tâche comme terminée
export const completeTask = async (taskId: string) => {
  const taskRef = doc(db, "tasks", taskId);
  await updateDoc(taskRef, { completed: true });
};

// Récupérer les données d’un utilisateur
export const getUserData = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    // Si l'utilisateur n'existe pas, on l'initialise
    await setDoc(userRef, { level: 1, xp: 0 });
    return { level: 1, xp: 0 };
  }
};

// Mettre à jour l'XP et le niveau d'un utilisateur
export const updateUserXP = async (userId: string, newXP: number, newLevel: number) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, { xp: newXP, level: newLevel });
};
