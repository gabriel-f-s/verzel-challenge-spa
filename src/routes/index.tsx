import type { ReactElement } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

import { Login } from '../pages/Login';
import { Register } from '../pages/Register';
import { Dashboard } from '../pages/Dashboard';
import { MyTickets } from '../pages/MyTickets';
import { SharedTicket } from '../pages/SharedTicket';
import { PortariaScanner } from '../pages/PortariaScanner';

function PrivateRoute({ children }: { children: ReactElement }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div>Carregando...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rotas Públicas */}
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />
        <Route path="/ticket/share/:token" element={<SharedTicket />} />

        {/* Rotas Privadas */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/my-tickets" element={
          <PrivateRoute>
            <MyTickets />
          </PrivateRoute>
        } />

        <Route path="/scanner" element={
          <PrivateRoute>
            <PortariaScanner />
          </PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
      </Routes>
    </AnimatePresence>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
