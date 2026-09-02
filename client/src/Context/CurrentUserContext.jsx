import React, { createContext, useContext, useState, useEffect } from "react";

const CurrentUserContext = createContext();

// Custom hook
const useCurrentUser = () => useContext(CurrentUserContext);

// Provider
const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  const logout = () => {
    alert("You want to logout");
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, setCurrentUser, logout }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export { useCurrentUser, CurrentUserProvider };
