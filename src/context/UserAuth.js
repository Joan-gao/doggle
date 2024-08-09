import create from "zustand";
import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import axios from "axios";

const useStore = create((set) => ({
  user: null,
  loading: true,
  fetchUserData: async (firebaseUser) => {
    if (firebaseUser) {
      const uid = firebaseUser.uid;
      try {
        const response = await axios.post(
          "https://doogle-1c3b68536bb7.herokuapp.com/user/get",
          { uid: uid },
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
        const userData = response.data;
        set({ user: userData });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    } else {
      set({ user: null });
    }
  },
  setLoading: (loading) => set({ loading }),
}));

const useAuth = () => {
  const auth = getAuth();
  const { fetchUserData, setLoading } = useStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      await fetchUserData(firebaseUser);
      setLoading(false);
    });

    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchUserData(currentUser).then(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => unsubscribe();
  }, [fetchUserData, setLoading]);
};

export { useStore, useAuth };
