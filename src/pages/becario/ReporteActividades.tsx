import React from 'react';
import { Button } from '../../components/ui/Button';

const ReporteActividades: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Reporte de Actividades</h1>
        <Button>Nuevo Reporte</Button>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Mis Reportes</h2>
        <div className="text-center py-12">
          <p className="text-gray-500">No hay reportes disponibles</p>
          <p className="text-sm text-gray-400 mt-2">
            Crea tu primer reporte de actividades haciendo clic en "Nuevo Reporte"
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReporteActividades;