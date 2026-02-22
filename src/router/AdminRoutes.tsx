import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/dashboard/AdminDashboard';
import MiPerfil from '../pages/common/MiPerfil';
import Formatos from '../pages/admin/Formatos';
import Reportes from '../pages/admin/Reportes';
import Becarios from '../pages/admin/Becarios';
import Facilitadores from '../pages/admin/Facilitadores';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="becarios" element={<Becarios />} />
        <Route path="facilitadores" element={<Facilitadores />} />
        <Route path="fotos" element={<div style={{ padding: '24px' }}>Fotos Admin</div>} />
        <Route path="formatos" element={<Formatos />} />
        <Route path="mi-perfil" element={<MiPerfil />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;