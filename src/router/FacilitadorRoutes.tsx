import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FacilitadorLayout from '../layouts/FacilitadorLayout';
import FacilitadorDashboard from '../pages/dashboard/FacilitadorDashboard';
import MiPerfil from '../pages/common/MiPerfil';
import Becarios from '../pages/facilitador/Becarios';
import Reportes from '../pages/facilitador/Reportes';
import Capacitacion from '../pages/facilitador/Capacitacion';
import Fotos from '../pages/facilitador/Fotos';
import Formatos from '../pages/facilitador/Formatos';

const FacilitadorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FacilitadorLayout />}>
        <Route index element={<FacilitadorDashboard />} />
        <Route path="becarios" element={<Becarios />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="capacitacion" element={<Capacitacion />} />
        <Route path="fotos" element={<Fotos />} />
        <Route path="formatos" element={<Formatos />} />
        <Route path="mi-perfil" element={<MiPerfil />} />
      </Route>
      <Route path="*" element={<Navigate to="/facilitador" replace />} />
    </Routes>
  );
};

export default FacilitadorRoutes;