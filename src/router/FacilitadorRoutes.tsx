import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const FacilitadorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route index element={<div>Facilitador Dashboard</div>} />
      <Route path="*" element={<Navigate to="/facilitador" replace />} />
    </Routes>
  );
};

export default FacilitadorRoutes;