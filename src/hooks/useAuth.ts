// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";

import { auth } from "../firebase/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Si l'utilisateur est authentifié, on met à jour l'état
      } else {
        setUser(null); // Sinon, l'utilisateur est déconnecté
      }
      setLoading(false); // L'état de chargement est terminé après la première vérification
    });

    // Nettoyage de l'abonnement lors du démontage du composant
    return () => unsubscribe();
  }, []);

  return { user, loading };
};
