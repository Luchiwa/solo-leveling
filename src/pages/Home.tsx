// /src/pages/Home.tsx
import { logout } from "../services/authService";
import { useAuth } from "../hooks/useAuth";

import TaskList from "../components/TaskList";

const Home = () => {
  const { user, loading } = useAuth();

  console.log('user', user)
  const handleLogout = async () => {
    await logout();
  };

  if (loading) return <p>Chargement en cours...</p>

  return (
    <div>
      <h1>Bienvenue sur Solo Leveling </h1>
      <p>Bienvenue, {user.email}</p>
      <TaskList />
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
};

export default Home;
