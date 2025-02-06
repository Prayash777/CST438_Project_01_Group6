import { createContext, useContext, useState, ReactNode } from 'react';
import { registerUser, loginUser, logoutUser } from '../services/authServices';

interface AuthContextType {
  isAuthenticated: boolean;
  username: string | null;
  token: string | null;
  login: (username: string, token: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, token: string) => Promise<void>;
  updateUser: (data: { name: string; email: string }) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const login = async (username: string, token: string) => {
    try {
      await loginUser(username, token);
      setIsAuthenticated(true);
      setUsername(username);
      setToken(token);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (username && token) {
        await logoutUser(username, token);
      }
      setIsAuthenticated(false);
      setUsername(null);
      setToken(null);
    } catch (error) {
      throw error;
    }
  };

  const register = async (username: string, token: string) => {
    try {
      await registerUser({
        username,
        token,
        agreeTermsOfService: "yes",
        notMinor: "yes"
      });
      await login(username, token);
    } catch (error) {
      throw error;
    }
  };

  const updateUser = async (data: { name: string; email: string }) => {
    try {
      if (!username || !token) throw new Error('Not authenticated');
      // TODO: update logic
      console.log('Update user:', data);
    } catch (error) {
      throw error;
    }
  };

  const deleteAccount = async () => {
    try {
      if (!username || !token) throw new Error('Not authenticated');
      await logout();
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      username,
      token,
      login,
      logout,
      register,
      updateUser,
      deleteAccount
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 