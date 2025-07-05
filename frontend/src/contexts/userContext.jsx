import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

const fetchUser = async () => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('currentUser');

  const safeParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  if (!token && !savedUser) {
    setLoading(false);
    return;
  }

  const parsedUser = safeParse(savedUser);

  if (parsedUser) {
    setCurrentUser(parsedUser);
  } else {
    try {
      const res = await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCurrentUser(res.data.user);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user));
    } catch (err) {
      console.error("Auth verification failed:", err);
      setCurrentUser(null);
    }
  }

  setLoading(false);
};

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
