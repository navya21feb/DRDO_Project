import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
  const token = localStorage.getItem('token');
  const savedUser = localStorage.getItem('currentUser');

  if (!token && !savedUser) {
    setLoading(false);
    return;
  }

  if (savedUser) {
    setCurrentUser(JSON.parse(savedUser));
  } else {
    try {
      const res = await axios.get('/api/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(res.data.user);
      localStorage.setItem('currentUser', JSON.stringify(res.data.user)); // ✅ Save backend version too
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
