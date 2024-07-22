import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);
const GlobalProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setIsLogged(false);
        setUser(null);
      }
      setLoading(false);
    });

    // 清除订阅
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        setIsLogged,
        user,
        setUser,
        loading,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
