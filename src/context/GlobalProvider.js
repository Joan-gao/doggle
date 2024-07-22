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
        fetch("http://127.0.0.1:5000/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: JSON.stringify({
            uid: user.uid, // 根据实际用户ID字段名称调整
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            setIsLogged(true);
            setUser(data);
          });
      } else {
        setIsLogged(false);
        setUser(null);
      }
      setLoading(false);
    });

    // 清除订阅
    return () => unsubscribe();
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
