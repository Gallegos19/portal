import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BecarioLayout from '../layouts/BecarioLayout';
import BecarioDashboard from '../pages/dashboard/BecarioDashboard';

// Lazy load pages
const ReporteActividades = React.lazy(() => import('../pages/becario/ReporteActividades'));
const ReporteBecas = React.lazy(() => import('../pages/becario/ReporteBecas'));
const MiPerfil = React.lazy(() => import('../pages/common/MiPerfil'));
const Documentos = React.lazy(() => import('../pages/becario/Documentos'));
const DocumentosAcademicos = React.lazy(() => import('../pages/becario/DocumentosAcademicos'));
// const DocumentosPersonales = React.lazy(() => import('../pages/becario/DocumentosPersonales'));
// const DocumentosAcademicos = React.lazy(() => import('../pages/becario/DocumentosAcademicos'));
const Capacitacion = React.lazy(() => import('../pages/becario/Capacitacion'));
const HistoriasExito = React.lazy(() => import('../pages/becario/HistoriasExito'));

const BecarioRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<BecarioLayout />}>
        <Route index element={<BecarioDashboard />} />
        <Route path="actividades" element={<ReporteActividades />} />
        <Route path="becas" element={<ReporteBecas />} />
        <Route path="perfil" element={<MiPerfil />} />
        <Route path="mi-perfil" element={<MiPerfil />} />
        <Route path="documentos-academicos" element={<Documentos />} />  
        <Route path="documentos-personales" element={<DocumentosAcademicos />} />  
        {/* <Route path="documentos">
          <Route index element={<Documentos />} />
          <Route path="personales" element={<Documentos />} />
          <Route path="academicos" element={<Documentos />} />
        </Route> */}
        <Route path="capacitacion" element={<Capacitacion />} />
        <Route path="historias-exito" element={<HistoriasExito />} />
      </Route>
    </Routes>
  );
};

export default BecarioRoutes;