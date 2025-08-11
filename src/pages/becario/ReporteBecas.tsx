import React from 'react';

const ReporteBecas: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Reporte de Becas</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Estado de mi Beca</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">Información de becas próximamente</p>
        </div>
      </div>
    </div>
  );
};

export default ReporteBecas;