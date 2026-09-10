import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../lib/firebase";
import { useAuthStore } from "../stores/authStore";
import api from "../lib/api";

export function useAuthInit() {
  const { setUser, setLoading, setInitialized, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const { data } = await api.get("/auth/me");
          setUser(data.data.user);
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
          logout();
        }
      } else {
        logout();
      }
      setLoading(false);
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [setUser, setLoading, setInitialized, logout]);
}
