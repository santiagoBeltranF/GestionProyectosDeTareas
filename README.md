# GestionProyectosDeTareas

Gestor de Proyectos Full-Stack (Node.js/Express + React)
Este es un proyecto Full-Stack que incluye un backend de API RESTful construido con Node.js y Express, y un frontend interactivo construido con React.
🚀 Backend (Node.js/Express)
El backend es el núcleo de la aplicación, responsable de la lógica de negocio, la comunicación con la base de datos (MongoDB) y la gestión de la autenticación de usuarios mediante API.
✨ Características Backend
API RESTful: Endpoints bien definidos para gestionar usuarios, proyectos y tareas.
Autenticación JWT: Implementa rutas de registro (/api/auth/register) y login (/api/auth/login) utilizando JSON Web Tokens (JWT) para sesiones seguras.
Gestión de Usuarios: Modelo User con Mongoose para interactuar con MongoDB, incluyendo el hash de contraseñas con bcryptjs.
Base de Datos: Configurado para MongoDB utilizando Mongoose como ODM (Object Data Modeling).
Middleware y Ruteo: Estructura modular para rutas y middleware (manejo de errores, CORS, validación de peticiones).
Variables de Entorno: Uso de dotenv para gestionar variables sensibles como la clave secreta de JWT y la URI de la base de datos.
Scripts de Inicialización (Seeders): Incluye un script para crear un usuario de prueba inicial en la base de datos.
✅ Requisitos Previos Backend
Node.js: Versión 18.x o superior.
npm (o Yarn): Gestor de paquetes de Node.js.
MongoDB: Una instancia de MongoDB local o en la nube (como MongoDB Atlas).
⚙️ Configuración e Instalación Backend
Navega a la carpeta backend:
code
Sh
cd backend
Instala las dependencias de Node.js:
code
Sh
npm install
Copia el archivo de entorno:
code
Sh
cp .env.example .env
Configura las variables de entorno en el archivo .env:
Abre el archivo .env y actualiza las variables, especialmente MONGO_URI con tu cadena de conexión a MongoDB y JWT_SECRET con una cadena aleatoria y segura.
code
Env
PORT=5000
MONGO_URI=mongodb://localhost:27017/projectmanager
JWT_SECRET=TU_CLAVE_SECRETA_AQUI
Ejecuta el script de inicialización para poblar la base de datos:
Este comando (personalizado en package.json) borrará los datos existentes y creará un usuario de prueba.
code
Sh
npm run seed
▶️ Ejecutar el Servidor de Desarrollo Backend
Para iniciar el servidor con recarga automática (usando nodemon):
code
Sh
npm run dev
El backend estará disponible en http://localhost:5000 (o el puerto que hayas configurado en .env).
⚛️ Frontend (React)
El frontend es la interfaz de usuario, desarrollada con React, que consume la API del backend para permitir la interacción del usuario con la aplicación de manera dinámica y reactiva.
✨ Características Frontend
Login de Usuario: Formulario de inicio de sesión que se comunica con el backend para obtener un token JWT.
Gestión de Estado: Utiliza Hooks de React (useState, useEffect, useContext) para manejar el estado de la aplicación, incluyendo la autenticación del usuario.
Gestión de Proyectos:
Listado de proyectos obtenidos de la API.
Formularios para crear y editar proyectos.
Confirmación de eliminación de proyectos.
Gestión de Tareas:
Listado de tareas filtrado por proyecto.
Formularios para crear y editar tareas.
Funcionalidad para marcar tareas como completadas.
Rutas Protegidas (Private Routes): Utiliza React Router para proteger las rutas que requieren autenticación, redirigiendo al login si el usuario no ha iniciado sesión.
Material-UI (MUI): Utiliza componentes de MUI para una interfaz de usuario moderna, limpia y responsiva.
Axios: Cliente HTTP para realizar peticiones a la API del backend de forma sencilla y centralizada.
CSS Modules / SCSS: Estilos organizados por componente para evitar colisiones de nombres y mejorar la mantenibilidad.
✅ Requisitos Previos Frontend
Node.js: Versión 18.x o superior.
npm (o Yarn): Gestor de paquetes de Node.js.
⚙️ Configuración e Instalación Frontend
Navega a la carpeta frontend:
code
Sh
cd frontend
Instala las dependencias de Node.js:
code
Sh
npm install
▶️ Ejecutar la Aplicación Frontend
Para iniciar el servidor de desarrollo de React (generalmente creado con Create React App o Vite):
code
Sh
npm start
La aplicación estará disponible en http://localhost:3000/. Se abrirá automáticamente en tu navegador predeterminado.
🔗 Integración entre Backend y Frontend
Para que la aplicación funcione correctamente, ambos servicios (backend y frontend) deben estar corriendo simultáneamente:
Inicia el backend: Abre una terminal, navega a la carpeta backend/ y ejecuta npm run dev.
code
Sh
cd backend
npm run dev
Mantén esta terminal abierta.
Inicia el frontend: Abre una nueva terminal, navega a la carpeta frontend/ y ejecuta npm start.
code
Sh
cd frontend
npm start
Mantén esta terminal abierta.
Una vez que ambos estén corriendo, podrás acceder al frontend en http://localhost:3000 e interactuar con la API del backend que corre en http://localhost:5000.
🔑 Credenciales de Prueba
Para iniciar sesión en la aplicación, puedes usar el siguiente usuario creado por el script seed del backend:
Email: test@example.com
Contraseña: password
