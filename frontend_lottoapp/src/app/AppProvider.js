import React, { createContext, useEffect, useMemo, useState } from 'react';
import { getItem, setItem, removeItem } from '../services/storage/localStorage';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async (_login, _password) => {},
  logout: async () => {},
});

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getItem('auth_user', null);
      if (saved) setUser(saved);
      setLoading(false);
    })();
  }, []);

  const login = async (login, password, authFn) => {
    const profile = await authFn(login, password);
    setUser(profile);
    await setItem('auth_user', profile);
    return profile;
  };

  const logout = async () => {
    setUser(null);
    await removeItem('auth_user');
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
