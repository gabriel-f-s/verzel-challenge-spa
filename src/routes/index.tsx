import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

import { Login } from '../pages/Login';
import { Register } from '../pages/Register';

// Um componente simples para proteger rotas privadas futuramente
function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Futuras Rotas Privadas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <div style={{ padding: '2rem' }}>
              <h1>Dashboard</h1>
              <p>Bem-vindo ao sistema de ingressos Verzel!</p>
            </div>
          </PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}
