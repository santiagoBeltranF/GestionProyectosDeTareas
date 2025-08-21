# GestionProyectosDeTareas

📌 Gestor de Proyectos Full-Stack (Node.js/Express + React)

Este es un proyecto Full-Stack que incluye:

🔹 Backend: API RESTful construida con Node.js + Express + MongoDB

🔹 Frontend: Interfaz interactiva construida con React + Material UI

🚀 Tecnologías

Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs

Frontend: React, React Router, Axios, Material-UI, Hooks

⚙️ Backend (Node.js/Express)

El backend es el núcleo de la aplicación: maneja la lógica de negocio, la base de datos y la autenticación de usuarios mediante API.

✨ Características

API RESTful: Endpoints para usuarios, proyectos y tareas

Autenticación JWT: Rutas /api/auth/register y /api/auth/login

Gestión de Usuarios: Modelo User con Mongoose y contraseñas hasheadas con bcryptjs

Base de Datos: Conexión a MongoDB (local o en la nube con MongoDB Atlas)

Middleware: Manejo de errores, CORS y validaciones

Variables de Entorno: .env con configuración de DB y JWT

Seeders: Script para poblar datos iniciales con un usuario de prueba

✅ Requisitos Previos

Node.js 18.x o superior

npm (o Yarn)

MongoDB

🔧 Instalación
cd backend
npm install
cp .env.example .env


Configura tu .env:

PORT=5000
MONGO_URI=mongodb://localhost:27017/projectmanager
JWT_SECRET=TU_CLAVE_SECRETA_AQUI

▶️ Inicialización

Ejecutar el script seed para poblar la base de datos:

npm run seed

▶️ Servidor de desarrollo
npm run dev


Backend disponible en: http://localhost:5000

⚛️ Frontend (React)

El frontend consume la API del backend y permite gestionar proyectos y tareas de forma dinámica.

✨ Características

Login de Usuario con JWT

Gestión de Estado con Hooks (useState, useEffect, useContext)

Proyectos: Listar, crear, editar y eliminar

Tareas: Listar, crear, editar y marcar como completadas

Rutas Protegidas con React Router

Interfaz Moderna con Material UI

Peticiones HTTP centralizadas con Axios

Estilos Modulares con CSS/SCSS

✅ Requisitos Previos

Node.js 18.x o superior

npm (o Yarn)

🔧 Instalación
cd frontend
npm install

▶️ Servidor de desarrollo
npm start


Frontend disponible en: http://localhost:3000

🔗 Integración Frontend + Backend

Ejecutar ambos servicios al mismo tiempo:

📌 En una terminal:

cd backend
npm run dev


📌 En otra terminal:

cd frontend
npm start


Frontend: http://localhost:3000

Backend: http://localhost:5000

🔑 Credenciales de Prueba

Puedes iniciar sesión con el usuario generado por el script seed:

Email: test@example.com

Contraseña: contraseña

📄 Licencia

Este proyecto es de uso libre para fines educativos y de práctica.
