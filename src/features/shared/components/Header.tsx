import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex justify-between items-center px-6 py-3">
        {/* Título de la página */}
        <h1 className="text-lg font-medium text-gray-800">Becarios</h1>
        
        {/* Menú de navegación */}
        <div className="flex items-center">
          <div className="flex space-x-1">
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <span className="flex items-center">
                <span className="mr-1">🏠</span>
                Inicio
              </span>
            </button>
            
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <span className="flex items-center">
                <span className="mr-1">📊</span>
                PECO
              </span>
            </button>
            
            <button className="px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md">
              <span className="flex items-center">
                <span className="mr-1">📁</span>
                Reportes
              </span>
            </button>
            
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <span className="flex items-center">
                <span className="mr-1">👥</span>
                Proyectos
              </span>
            </button>
            
            <button className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md">
              <span className="flex items-center">
                <span className="mr-1">📈</span>
                Capacitación
              </span>
            </button>
          </div>
          
          {/* Perfil usuario */}
          <div className="ml-4 flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              <img 
                src="/avatar.jpg" 
                alt="Usuario" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;