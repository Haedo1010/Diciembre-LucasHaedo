# Proyecto-II-GymConnect

GymConnect: Sistema de gestión de gimnasio con autenticación de usuarios, gestión de clases, tienda integrada y perfiles personalizados. Desarrollado con React y Node.js como parte de la materia Proyecto II.

---

Este proyecto es desarrollado por el grupo 5°1 como parte de la materia Proyecto II.

## Integrantes del Grupo

- Lautaro Palombo
- Carolina Lobo
- Lucas Haedo
- Thomas Barrera
- Santiago Lavorgnia

---

## Visión del Proyecto

GymConnect es un sistema de gestión integral para gimnasios que permite a los miembros gestionar su perfil, visualizar clases disponibles y reservar cupos. El sistema contempla diferentes roles de usuario (administrador, entrenador y cliente) con permisos específicos para cada uno. Incluye una tienda integrada y un sistema robusto de persistencia de datos.

---

## Stack Tecnológico

### Frontend
- React 18.3.1
- Vite 5.4.10
- React Router DOM 7.0.1
- Axios para peticiones HTTP
- CSS personalizado con diseño responsive

### Backend
- Node.js con Express 4.21.2
- Sequelize 6.37.5 (ORM)
- SQLite (desarrollo local con persistencia real)
- CORS para peticiones cross-origin
- Dotenv para manejo de variables de entorno
- Nodemailer para envío de emails

---

## Características Principales

### Módulos Implementados

- **Autenticación de Usuarios:** Sistema de registro y login con validación y seguridad.
- **Gestión de Perfiles:** Los usuarios pueden ver y editar su información personal.
- **Sistema de Roles:** Diferenciación entre administrador, entrenador y cliente con permisos en backend y frontend.
- **Gestión de Clases:** Visualización, creación y eliminación de clases, con control de cupos y horarios.
- **Inscripción a Clases:** Los clientes pueden inscribirse y desinscribirse de clases disponibles.
- **Dashboard Personalizado:** Panel de control con información relevante según el rol del usuario.
- **Panel de Administración:** Gestión y eliminación de usuarios, cambio de roles y aprobación de solicitudes para profesores.
- **Sistema de Solicitudes de Profesor:** Los usuarios pueden solicitar ser profesores, con aprobación por admin y envío automático de emails.
- **Tienda Integrada:** Catálogo de productos con interfaz clara y funcional.
- **Persistencia Completa:** Datos guardados en SQLite que no se pierden tras cerrar sesión o reiniciar.
- **Generación Automática de Emails:** El sistema genera automáticamente emails corporativos para nuevos profesores.
- **Favicon Personalizado:** Logo del proyecto en todas las pestañas del navegador.
- **Diseño Responsive:** Interfaz moderna y adaptable a diferentes dispositivos.

---

## Estructura del Proyecto
Proyecto-II-GymConnect/
├── backend/ # Servidor Express y Sequelize
│ ├── src/
│ │ ├── config/
│ │ │ ├── initbd.js # Configuración SQLite
│ │ │ └── email.js # Configuración de emails
│ │ ├── models/ # Modelos Sequelize
│ │ │ ├── User.js
│ │ │ ├── Class.js
│ │ │ ├── Enrollment.js
│ │ │ ├── ProfesorRequest.js
│ │ │ ├── Product.js
│ │ │ └── asociacion.js
│ │ └── routes/ # Rutas API
│ │ ├── auth.routes.js
│ │ ├── class.routes.js
│ │ ├── enrollment.routes.js
│ │ ├── profesor.routes.js
│ │ ├── admin.routes.js
│ │ └── shop.routes.js
│ ├── server.js # Punto de entrada backend
│ ├── package.json
│ ├── .env.example
│ └── database.sqlite # Base de datos (generada automáticamente)
│
├── frontend/ # React + Vite
│ ├── src/
│ │ ├── components/ # Componentes reutilizables
│ │ ├── pages/ # Páginas principales
│ │ ├── services/ # APIs y servicios
│ │ ├── contexts/ # Context API
│ │ ├── App.jsx
│ │ ├── main.jsx
│ │ └── index.css
│ ├── public/ # Assets estáticos
│ ├── package.json
│ └── vite.config.js
│
└── README.md


---

## Instrucciones de Instalación

### Requisitos Previos
- Node.js (v16+)
- npm o yarn

### 1. Clonar el repositorio

git clone https://github.com/lobocarolinael36-boop/Proyecto-II-GymConnect.git
cd Proyecto-II-GymConnect

### 2. Configurar Backend

cd backend
npm install

Crear un archivo `.env` en la carpeta `backend`:

PORT=5000
EMAIL_USER=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

### 3. Configurar Frontend

cd ../frontend
npm install


---

## Ejecución del Proyecto

### Backend

cd backend
npm run dev

El backend corre en `http://localhost:5000`.

### Frontend

cd frontend
npm run dev

El frontend corre en `http://localhost:5173`.

---

## API Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/profile` - Obtener perfil (requiere login)
- `PUT /api/auth/profile` - Actualizar perfil
- `DELETE /api/auth/account` - Eliminar cuenta

### Clases
- `GET /api/clases` - Obtener todas las clases
- `GET /api/clases/:id` - Obtener clase por ID
- `POST /api/clases` - Crear nueva clase (solo profesores/admin)
- `GET /api/clases/:id/instructor` - Obtener clases por instructor

### Inscripciones
- `POST /api/inscripciones` - Inscribirse a una clase
- `DELETE /api/inscripciones/:id` - Desinscribirse de una clase
- `GET /api/inscripciones/usuario/:id` - Obtener inscripciones del usuario

### Solicitudes de Profesor
- `POST /api/profesor/solicitar` - Enviar solicitud para ser profesor
- `GET /api/profesor` - Obtener todas las solicitudes (solo admin)
- `POST /api/profesor/:id/aprobar` - Aprobar solicitud (solo admin)
- `POST /api/profesor/:id/rechazar` - Rechazar solicitud (solo admin)

### Administración
- `GET /api/admin/usuarios` - Obtener lista de usuarios
- `PATCH /api/admin/usuarios/:id/cambiar-rol` - Cambiar rol de usuario
- `DELETE /api/admin/usuarios/:id` - Eliminar usuario

### Tienda
- `GET /api/shop/productos` - Obtener todos los productos
- `POST /api/shop/compra` - Realizar una compra

---

## Usuarios de Prueba

Al iniciar el backend se crean automáticamente:

- **Admin:**
  - Email: `admin@gymconnect.com`
  - Contraseña: `admin123`

- **Profesor de Ejemplo:**
  - Email: `carlos.profesor@profesor.gymconnect.com`
  - Contraseña: `profesor123`

---

## Mejoras Realizadas en Esta Versión

✅ **Migración a SQLite** con persistencia real en lugar de almacenamiento temporal.

✅ **Sistema de Solicitudes de Profesor** con aprobación por admin y envío automático de emails.

✅ **Corrección de Generación de Emails Corporativos** (formato: nombre.profesor@profesor.gymconnect.com).

✅ **Panel Administrador Funcional** para gestionar usuarios, cambiar roles y eliminar cuentas.

✅ **Soporte Completo de Roles** (admin, profesor, cliente) con permisos diferenciados.

✅ **Tienda Integrada** con catálogo de productos.

✅ **Inscripción y Gestión de Clases** completamente funcional.

✅ **Favicon Personalizado** para mejor branding.

✅ **Logout, Registro y Edición de Perfil** operativos.

✅ **Backend Robusto** con rutas seguras y fáciles de mantener.

---

## Próximas Mejoras

- Sistema de notificaciones en tiempo real.
- Feed social con comentarios y reseñas de clases.
- Sistema de pagos integrado.
- Logros y gamificación.
- Exportación de reportes.
- Sistema de mensajería entre usuarios.

---

## Notas Técnicas

### Base de Datos
La base de datos SQLite se sincroniza automáticamente al iniciar el backend. Los archivos `inicialización.sql` no son necesarios ya que Sequelize maneja la creación de tablas.

### Asociaciones de Modelos
Los modelos están conectados a través del archivo `asociacion.js`, que define las relaciones Many-to-Many entre usuarios y clases mediante la tabla de inscripciones.

### Seguridad
- Las contraseñas se almacenan como texto plano (en desarrollo). Para producción, usar bcrypt.
- El JWT (si se implementa) debe almacenarse en localStorage o sessionStorage.
- CORS está habilitado solo para desarrollo local.

---

## Licencia

Proyecto 100% educativo para Proyecto II.

---

## Contacto

Grupo 5°1 - Proyecto II

[GitHub Repo](https://github.com/lobocarolinael36-boop/Proyecto-II-GymConnect)

---

¡Gracias por usar GymConnect! 🏋️‍♀️💪


