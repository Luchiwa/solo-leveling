// /src/services/taskService.ts
import { collection, addDoc, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Fonction pour écouter les tâches en temps réel
export const listenToTasks = (setTasks: (tasks: any[]) => void) => {
  const tasksRef = collection(db, "tasks");

  const unsubscribe = onSnapshot(tasksRef, (snapshot) => {
    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTasks(tasks);
  });

  return unsubscribe;
};

// Fonction pour ajouter une tâche
export const addTask = async (task: { title: string; difficulty: string; xpReward: number }) => {
  try {
    await addDoc(collection(db, "tasks"), task);
  } catch (error) {
    console.error("Erreur lors de l'ajout de la tâche:", error);
  }
};

// Fonction pour supprimer une tâche
export const deleteTask = async (taskId: string) => {
  try {
    await deleteDoc(doc(db, "tasks", taskId));
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
  }
};
