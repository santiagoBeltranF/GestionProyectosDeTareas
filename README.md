# 🚀 Gestor de Proyectos Full-Stack

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?logo=node.js)](https://nodejs.org/) 
[![Express](https://img.shields.io/badge/Express.js-Backend-lightgrey?logo=express)](https://expressjs.com/) 
[![Angular](https://img.shields.io/badge/Angular-Frontend-DD0031?logo=angular&logoColor=white)](https://angular.dev/) 
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen?logo=mongodb)](https://www.mongodb.com/) 
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Aplicación **Full-Stack** para gestión de proyectos y tareas.  
Incluye un **backend** con autenticación JWT y un **frontend** moderno con Angular.

---

## 📌 Tabla de Contenidos
- [⚙️ Backend (Node.js/Express)](#️-backend-nodejsexpress)
- [🅰️ Frontend (Angular)](#️-frontend-angular)
- [🔗 Integración Frontend + Backend](#-integración-frontend--backend)
- [🔑 Credenciales de Prueba](#-credenciales-de-prueba)
- [📄 Licencia](#-licencia)

---

## ⚙️ Backend (Node.js/Express)

📍 **Características principales**
- ✅ API RESTful para **usuarios, proyectos y tareas**
- 🔐 Autenticación con **JWT**
- 👤 Modelo `User` con **Mongoose + bcryptjs**
- 🗄️ Conexión a **MongoDB (local o Atlas)**
- ⚡ Middleware modular: CORS, validación, manejo de errores
- 🌱 Script `seed` para generar usuario de prueba

📍 **Requisitos Previos**
- Node.js **18.x o superior**  
- npm o Yarn  
- MongoDB  

📍 **Instalación**
```bash
cd backend
npm install
cp .env.example .env
Configura el archivo .env:

env
Copiar
Editar
PORT=5000
MONGO_URI=mongodb://localhost:27017/projectmanager
JWT_SECRET=TU_CLAVE_SECRETA_AQUI
📍 Inicializar con datos de prueba

bash
Copiar
Editar
npm run seed
📍 Ejecutar servidor

bash
Copiar
Editar
npm run dev
📍 Disponible en: http://localhost:5000

🅰️ Frontend (Angular)
📍 Características principales

🔑 Login de usuario con JWT

📂 Gestión de proyectos y tareas (CRUD completo)

🔒 Rutas protegidas con Angular Router

🎨 UI moderna con Tailwind CSS (o Angular Material si prefieres)

📡 Peticiones HTTP con HttpClient

🎭 Lazy Loading para módulos y componentes

⚡ RxJS para gestión de flujos y peticiones

📍 Requisitos Previos

Node.js 18.x o superior

Angular CLI instalado globalmente:

bash
Copiar
Editar
npm install -g @angular/cli
📍 Instalación

bash
Copiar
Editar
cd frontend
npm install
📍 Ejecutar servidor

bash
Copiar
Editar
ng serve
📍 Disponible en: http://localhost:4200

🔗 Integración Frontend + Backend
Ejecutar ambos servicios en paralelo:

bash
Copiar
Editar
# Backend
cd backend
npm run dev
bash
Copiar
Editar
# Frontend
cd frontend
ng serve
✅ Frontend → http://localhost:4200
✅ Backend → http://localhost:5000

🔑 Credenciales de Prueba
Email	Contraseña
test@example.com	contraseña

📄 Licencia
Este proyecto se distribuye bajo licencia MIT.
¡Úsalo libremente para aprender, mejorar y crear! 🎉
