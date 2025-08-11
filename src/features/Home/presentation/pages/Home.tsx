import Header from "../../../shared/components/Header";

type Founder = {
  id: number;
  name: string;
  image: string;
};


const Home = () => {
    const founders: Founder[] = [
    { id: 1, name: 'Jerry Youtz', image: '/founders/jerry-youtz.jpg' },
    { id: 2, name: 'Jim Hentzen', image: '/founders/jim-hentzen.jpg' },
    { id: 3, name: 'Nadine (Hentzen) Pearce', image: '/founders/nadine-pearce.jpg' },
    { id: 4, name: 'Bob Hentzen', image: '/founders/bob-hentzen.jpg' },
  ];
    return (
        <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}

      {/* Contenido principal */}
      <div className="flex-1">
        <Header />
        
        <main className="p-6">
          {/* Tarjeta de bienvenida */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Bienvenido al nuevo sistema del proyecto Kuxtai
                </h1>
                <p className="mt-2 text-gray-600 max-w-2xl">
                  Estamos aquí para facilitar la organización y el acceso a la información del trabajo pastoral y
                  humanitario, permitiendo que todos estemos conectados y unidos.
                </p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <span className="font-semibold mr-1">ID#:</span>
                  <span>BOB-16247234</span>
                </div>
              </div>
              <div className="bg-yellow-50 p-2 rounded-md flex items-center text-yellow-600">
                <span>⚠️</span>
              </div>
            </div>
          </div>

          {/* Sección de historia */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Nuestra Historia: nos representa y es vital recordar a quienes fueron clave para nuestro proyecto
            </h2>
            
            {/* Grid de fundadores */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              {founders.map((founder) => (
                <div key={founder.id} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden mb-2">
                    <img 
                      src={founder.image} 
                      alt={founder.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-center">{founder.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Footer */}
          <div className="flex justify-between items-center text-xs text-gray-500 mt-4 pb-4">
            <div>
              <span>REPORT 2024</span>
              <span className="ml-1 text-green-600">EN PROGRESO</span>
            </div>
            <div className="flex items-center">
              <span>Comentarios</span>
              <div className="ml-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                3
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
    );
}

export default Home;