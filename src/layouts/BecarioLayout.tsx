import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header/Header';
import Sidebar from '../components/layout/Sidebar/Sidebar';

const BecarioLayout: React.FC = () => {
  const sidebarItems = [
    { label: 'Reporte de Actividades', path: '/becario/actividades', icon: '📊' },
    { label: 'Reporte de Becas', path: '/becario/becas', icon: '🎓' },
    { label: 'Mi Perfil', path: '/becario/perfil', icon: '👤' },
    { label: 'Documentos', path: '/becario/documentos', icon: '📄' },
    { label: 'Capacitación', path: '/becario/capacitacion', icon: '📚' },
    { label: 'Historias de Éxito', path: '/becario/historias-exito', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar items={sidebarItems} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default BecarioLayout;