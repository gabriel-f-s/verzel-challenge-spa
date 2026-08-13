import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../services/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'ORGANIZADOR' | 'CLIENTE' | 'PORTARIA';
}

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (data: any) => Promise<void>;
  signUp: (data: any) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('@Verzel:user');
    const storedToken = localStorage.getItem('@Verzel:token');

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  async function signIn({ email, password }: any) {
    const response = await api.post('/auth/login', { email, password });
    
    const { accessToken, user } = response.data;

    localStorage.setItem('@Verzel:token', accessToken);
    localStorage.setItem('@Verzel:user', JSON.stringify(user));

    setUser(user);
  }

  async function signUp({ name, email, password, role }: any) {
    const response = await api.post('/auth/register', { name, email, password, role });
    
    const { accessToken, user } = response.data;

    localStorage.setItem('@Verzel:token', accessToken);
    localStorage.setItem('@Verzel:user', JSON.stringify(user));

    setUser(user);
  }

  function signOut() {
    localStorage.removeItem('@Verzel:token');
    localStorage.removeItem('@Verzel:user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
