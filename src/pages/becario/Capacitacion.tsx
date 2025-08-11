import React from 'react';

const Capacitacion: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Capacitación</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Mis Capacitaciones</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No hay capacitaciones disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default Capacitacion;