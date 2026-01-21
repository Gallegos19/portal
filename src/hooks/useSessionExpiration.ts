import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

/**
 * Hook que escucha eventos de expiración de sesión
 * Redirige al login cuando la sesión expira
 */
export const useSessionExpiration = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  useEffect(() => {
    const handleSessionExpired = () => {
      logout();
      navigate('/auth/login', { replace: true });
    };

    window.addEventListener('session-expired', handleSessionExpired);

    return () => {
      window.removeEventListener('session-expired', handleSessionExpired);
    };
  }, [logout, navigate]);
};
