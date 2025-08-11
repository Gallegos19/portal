# Portal UNBOUND - Frontend

Portal web para la gestión de becarios, facilitadores sociales y administradores del programa UNBOUND.

## 🚀 Tecnologías

- **React 18** - Framework principal
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Framework de estilos
- **Zustand** - Gestión de estado
- **React Router v6** - Enrutamiento
- **Axios** - Cliente HTTP
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación de esquemas

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (Button, Input, etc.)
│   ├── layout/         # Componentes de layout (Header, Sidebar)
│   └── forms/          # Componentes de formularios
├── pages/              # Páginas organizadas por usuario
│   ├── auth/           # Páginas de autenticación
│   ├── becario/        # Páginas de becarios
│   ├── facilitador/    # Páginas de facilitadores
│   └── admin/          # Páginas de administradores
├── layouts/            # Layouts por tipo de usuario
├── hooks/              # Custom hooks
├── store/              # Estado global (Zustand)
├── services/           # Servicios de API
├── types/              # Definiciones TypeScript
├── utils/              # Utilidades y helpers
├── guards/             # Guards de rutas y permisos
└── router/             # Configuración de rutas
```

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
```bash
cp .env.example .env.local
```

3. Iniciar servidor de desarrollo:
```bash
npm run dev
```

## 🔐 Autenticación y Roles

El sistema maneja tres tipos de usuarios:

- **BECARIO**: Acceso a reportes, perfil, documentos y capacitaciones
- **FACILITADOR**: Gestión de becarios y reportes
- **ADMIN**: Administración completa del sistema

## 🎨 Componentes UI

Los componentes base están en `src/components/ui/` y siguen un patrón consistente:

- **Button**: Botones con variantes (primary, secondary, outline, danger)
- **Input**: Campos de entrada con validación
- **Modal**: Modales reutilizables
- **Card**: Tarjetas de contenido

## 📱 Responsive Design

El diseño es completamente responsive usando Tailwind CSS con breakpoints:

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

## 🔄 Estado Global

Usando Zustand para el manejo de estado:

- **authStore**: Autenticación y usuario actual
- **notificationStore**: Notificaciones del sistema

## 🛡️ Guards y Permisos

- **AuthGuard**: Protege rutas que requieren autenticación
- **RoleGuard**: Controla acceso basado en roles de usuario

## 📊 Integración con API

La aplicación se conecta con la API backend a través de:

- **httpClient**: Cliente Axios configurado
- **Servicios específicos**: auth, becarios, facilitadores, etc.
- **Interceptors**: Manejo automático de tokens y errores

## 🚀 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linting con ESLint

## 🔧 Configuración

### Vite Config
- Aliases configurados para imports limpios
- Proxy para API en desarrollo
- Optimizaciones de build

### Tailwind Config
- Colores personalizados del proyecto
- Configuración responsive
- Plugins adicionales

## 📝 Convenciones

- **Componentes**: PascalCase
- **Archivos**: camelCase para JS/TS, kebab-case para assets
- **Tipos**: Interfaces con sufijo apropiado
- **Hooks**: Prefijo `use`
- **Stores**: Sufijo `Store`

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request