import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  role: 'admin' | 'user';
  name: string;
  email: string;
  avatar?: string;
  title?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, authToken?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const savedToken = localStorage.getItem('arutala_token');
        if (savedToken) {
          setToken(savedToken);
          await fetchUser(savedToken);
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      }
    };
    restoreSession();
  }, []);

  const fetchUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token might be invalid or expired
        logout();
      }
    } catch (e) {
      console.error('Error fetching user:', e);
    }
  };

  const login = (userData: User, authToken?: string) => {
    setUser(userData);
    if (authToken) {
      setToken(authToken);
      localStorage.setItem('arutala_token', authToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('arutala_token');
    window.location.hash = '#/login';
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
