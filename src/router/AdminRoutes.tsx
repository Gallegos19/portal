import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<div>Admin Dashboard</div>} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;