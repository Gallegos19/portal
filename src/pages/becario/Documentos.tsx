import React from 'react';

const Documentos: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Documentos</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Mis Documentos</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No hay documentos disponibles</p>
        </div>
      </div>
    </div>
  );
};

export default Documentos;