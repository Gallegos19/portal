import { useAuthStore } from '../store/authStore';
import { LoginCredentials } from '../types/auth';
import { ROUTES, USER_ROLES } from '../utils/constants';

export const useAuth = () => {
  const authStore = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    try {
      await authStore.login(credentials);
      
      // Return redirect path based on user role
      const user = useAuthStore.getState().user;
      if (user) {
        switch (user.role) {
          case USER_ROLES.BECARIO:
            return ROUTES.BECARIO.HOME;
          case USER_ROLES.FACILITADOR:
            return ROUTES.FACILITADOR.HOME;
          case USER_ROLES.ADMIN:
            return ROUTES.ADMIN.HOME;
          default:
            return '/';
        }
      }
      return '/';
    } catch (error) {
      throw error;
    }
  };

  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.userRole,
    isLoading: authStore.isLoading,
    login,
    logout: authStore.logout,
  };
};