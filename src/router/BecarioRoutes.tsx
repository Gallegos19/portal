import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BecarioLayout from '../layouts/BecarioLayout';

// Lazy load pages
const ReporteActividades = React.lazy(() => import('../pages/becario/ReporteActividades'));
const ReporteBecas = React.lazy(() => import('../pages/becario/ReporteBecas'));
const MiPerfil = React.lazy(() => import('../pages/becario/MiPerfil'));
const Documentos = React.lazy(() => import('../pages/becario/Documentos'));
const Capacitacion = React.lazy(() => import('../pages/becario/Capacitacion'));
const HistoriasExito = React.lazy(() => import('../pages/becario/HistoriasExito'));

const BecarioRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BecarioLayout />}>
        <Route index element={<Navigate to="actividades" replace />} />
        <Route path="actividades" element={<ReporteActividades />} />
        <Route path="becas" element={<ReporteBecas />} />
        <Route path="perfil" element={<MiPerfil />} />
        <Route path="documentos" element={<Documentos />} />
        <Route path="capacitacion" element={<Capacitacion />} />
        <Route path="historias-exito" element={<HistoriasExito />} />
      </Route>
    </Routes>
  );
};

export default BecarioRoutes;