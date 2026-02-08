import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '../guards/AuthGuard';
import RoleGuard from '../guards/RoleGuard';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import { UserRole } from '../types/auth';
import NotFound from '../pages/common/NotFound';
import LoadingScreen from '../components/common/LoadingScreen';

// Lazy load route components
const BecarioRoutes = React.lazy(() => import('./BecarioRoutes'));
const FacilitadorRoutes = React.lazy(() => import('./FacilitadorRoutes'));
const AdminRoutes = React.lazy(() => import('./AdminRoutes'));

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<LoadingScreen message="Cargando módulo..." />}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
          </Route>

          {/* Becario Routes */}
          <Route path="/becario/*" element={
            <AuthGuard>
              <RoleGuard allowedRoles={[UserRole.BECARIO]}>
                <BecarioRoutes />
              </RoleGuard>
            </AuthGuard>
          } />

          {/* Facilitador Routes */}
          <Route path="/facilitador/*" element={
            <AuthGuard>
              <RoleGuard allowedRoles={[UserRole.FACILITADOR]}>
                <FacilitadorRoutes />
              </RoleGuard>
            </AuthGuard>
          } />

          {/* Admin Routes */}
          <Route path="/admin/*" element={
            <AuthGuard>
              <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <AdminRoutes />
              </RoleGuard>
            </AuthGuard>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/auth/login" replace />} />
          
          {/* Catch-all route for 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;