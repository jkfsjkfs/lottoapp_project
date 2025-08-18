import * as React from 'react';
import { getItem, setItem, removeItem } from '../services/storage/localStorage';

import { createContext, useEffect, useMemo, useState } from 'react';


export const AuthContext = createContext(null);

export default function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const saved = await getItem('auth_user', null);
        if (mounted && saved) setUser(saved);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
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
