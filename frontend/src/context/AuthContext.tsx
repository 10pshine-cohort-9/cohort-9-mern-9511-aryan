import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/axios';
import { User, ApiResponse } from '../types';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<ApiResponse>;
  signup: (name: string, email: string, password: string) => Promise<ApiResponse>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore network errors on logout
    } finally {
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };

  useEffect(() => {
    const verifyUserSession = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data && res.data.success) {
            setUser(res.data.data);
            localStorage.setItem('user', JSON.stringify(res.data.data));
          } else {
            await logout();
          }
        } catch (error) {
          console.error('Session validation error:', error);
          await logout();
        }
      }
      setLoading(false);
    };

    verifyUserSession();
  }, [token]);

  const login = async (email: string, password: string): Promise<ApiResponse> => {
    try {
      const res = await api.post<ApiResponse>('/auth/login', { email, password });
      if (res.data && res.data.success) {
        const { user: userData, token: jwtToken } = res.data.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return res.data;
      }
      throw new Error(res.data?.message || 'Login failed');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<ApiResponse> => {
    try {
      const res = await api.post<ApiResponse>('/auth/signup', { name, email, password });
      if (res.data && res.data.success) {
        const { user: userData, token: jwtToken } = res.data.data;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        return res.data;
      }
      throw new Error(res.data?.message || 'Signup failed');
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Signup failed';
      throw new Error(message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
