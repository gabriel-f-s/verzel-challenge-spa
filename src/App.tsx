import { AuthProvider } from './contexts/AuthContext';
import { AppRoutes } from './routes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 4000, 
          style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } 
        }} 
      />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
