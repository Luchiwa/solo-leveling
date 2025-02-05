import { useEffect, useState } from "react";
import { getTasks, addTask, completeTask, getUserData, updateUserXP } from "./services/firebaseService";
import { calculateLevel } from "./utils/levelSystem";
import { signUp, login, logout } from "./services/authService";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; // 🔹 Import de Firebase Auth

const USER_ID = "user_123"; // ID temporaire (à remplacer par l'authentification plus tard)

type Task = {
  id: string;
  title: string;
  xp: number;
  completed: boolean;
};

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [user, setUser] = useState<any>(null); // Gérer l'utilisateur connecté
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Surveiller l'état de l'authentification
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Charger les tâches et les données utilisateur
  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        // Charger les données de l'utilisateur connecté
        const userData = await getUserData(user.uid);
        setTotalXP(userData.xp);
        setLevel(userData.level);

        // Charger les tâches
        const tasksList = await getTasks();
        setTasks(tasksList);
      }
    };

    fetchData();
  }, [user]);

  // Charger les tâches et calculer le niveau
  useEffect(() => {
    const fetchTasks = async () => {
      const tasksList = await getTasks();
      setTasks(tasksList);

      // Calculer l'XP et le niveau
      const earnedXP = tasksList
        .filter((task) => task.completed)
        .reduce((sum, task) => sum + task.xp, 0);
      setTotalXP(earnedXP);
      setLevel(calculateLevel(earnedXP));
    };

    fetchTasks();
  }, []);

   // Charger les tâches et les données utilisateur
   useEffect(() => {
    const fetchData = async () => {
      // Récupérer les tâches
      const tasksList = await getTasks();
      setTasks(tasksList);

      // Récupérer les données utilisateur
      const userData = await getUserData(USER_ID);
      setTotalXP(userData.xp);
      setLevel(userData.level);
    };

    fetchData();
  }, []);

  // Ajouter une tâche de test
  const handleAddTask = async () => {
    await addTask("Nouvelle quête", 3, "Développement");
    alert("Tâche ajoutée !");
  };

  // Marquer une tâche comme terminée et mettre à jour Firestore
  const handleCompleteTask = async (taskId: string, xp: number) => {
    await completeTask(taskId);
    
    const newXP = totalXP + xp;
    const newLevel = calculateLevel(newXP);
    
    setTotalXP(newXP);
    setLevel(newLevel);

    // Mettre à jour Firestore
    await updateUserXP(user.uid, newXP, newLevel);
  };

  // Gestion de l'inscription, de la connexion et de la déconnexion
  const handleSignUp = async () => {
    await signUp(email, password);
  };

  const handleLogin = async () => {
    await login(email, password);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h1>Solo Leveling</h1>

      {/* Affichage des tâches si l'utilisateur est connecté */}
      {user ? (
        <>
          <p>Niveau : {level} | XP : {totalXP}</p>
          <button onClick={handleAddTask}>Ajouter une tâche</button>
          <ul>
            {tasks.map((task) => (
              <li key={task.id}>
                {task.title} ({task.xp} XP)
                {!task.completed && (
                  <button onClick={() => handleCompleteTask(task.id, task.xp)}>
                    Terminer
                  </button>
                )}
              </li>
            ))}
          </ul>
          <button onClick={handleLogout}>Se déconnecter</button>
        </>
      ) : (
        <div>
          <h2>Connexion / Inscription</h2>
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
          <button onClick={handleSignUp}>S'inscrire</button>
          <button onClick={handleLogin}>Se connecter</button>
        </div>
      )}
    </div>
  );
}

export default App;
