import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import MiPerfil from '../pages/common/MiPerfil';
import Formatos from '../pages/admin/Formatos';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="reportes" element={<div style={{ padding: '24px' }}>Reportes Admin</div>} />
        <Route path="becarios" element={<div style={{ padding: '24px' }}>Becarios Admin</div>} />
        <Route path="facilitadores" element={<div style={{ padding: '24px' }}>Facilitadores Admin</div>} />
        <Route path="fotos" element={<div style={{ padding: '24px' }}>Fotos Admin</div>} />
        <Route path="formatos" element={<Formatos />} />
        <Route path="mi-perfil" element={<MiPerfil />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;