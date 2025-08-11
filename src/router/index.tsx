import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthGuard from '../guards/AuthGuard';
import RoleGuard from '../guards/RoleGuard';
import AuthLayout from '../layouts/AuthLayout';
import LoginPage from '../pages/auth/LoginPage';
import { UserRole } from '../types/auth';

// Lazy load route components
const BecarioRoutes = React.lazy(() => import('./BecarioRoutes'));
const FacilitadorRoutes = React.lazy(() => import('./FacilitadorRoutes'));
const AdminRoutes = React.lazy(() => import('./AdminRoutes'));

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<div className="flex items-center justify-center min-h-screen">Cargando...</div>}>
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
          
          {/* 404 */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;