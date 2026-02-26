import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import FacilitadorLayout from '../layouts/FacilitadorLayout';
import FacilitadorDashboard from '../pages/dashboard/FacilitadorDashboard';
import MiPerfil from '../pages/common/MiPerfil';
import Becarios from '../pages/facilitador/Becarios';
import Reportes from '../pages/facilitador/Reportes';
import Capacitacion from '../pages/facilitador/Capacitacion';
import Eventos from '../pages/facilitador/Eventos';
import Formatos from '../pages/facilitador/Formatos';
import HistoriasExito from '../pages/facilitador/HistoriasExito';

const FacilitadorRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<FacilitadorLayout />}>
        <Route index element={<FacilitadorDashboard />} />
        <Route path="becarios" element={<Becarios />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="capacitacion" element={<Capacitacion />} />
        <Route path="eventos" element={<Eventos />} />
        <Route path="fotos" element={<Navigate to="/facilitador/eventos" replace />} />
        <Route path="historias-exito" element={<HistoriasExito />} />
        <Route path="formatos" element={<Formatos />} />
        <Route path="mi-perfil" element={<MiPerfil />} />
      </Route>
      <Route path="*" element={<Navigate to="/facilitador" replace />} />
    </Routes>
  );
};

export default FacilitadorRoutes;