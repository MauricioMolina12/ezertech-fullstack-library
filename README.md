# 📚 Library Management System

Sistema de gestión de biblioteca desarrollado como prueba técnica Full Stack.

El proyecto permite administrar usuarios, libros, préstamos y reservas mediante una API REST desarrollada con Spring Boot, utilizando autenticación JWT y una base de datos PostgreSQL.

El proyecto está compuesto por:

- Backend desarrollado con Spring Boot.
- Frontend desarrollado con Angular.
- Base de datos PostgreSQL.
- Servicio de correo de pruebas mediante MailHog.
- Docker Compose para levantar el ambiente completo.


---

# 🏗️ Estructura del proyecto



ezertech-fullstack-library
│
├── backend
│ ├── Spring Boot API
│ ├── Spring Security + JWT
│ ├── JPA / Hibernate
│ └── Dockerfile
│
├── frontend
│ └── Angular Application
│
├── docker-compose.yaml
└── README.md



---

# 🚀 Tecnologías utilizadas


## Backend

- Java 21
- Spring Boot
- Spring Security
- JWT Authentication
- Spring Data JPA
- Hibernate
- Maven
- PostgreSQL


## Frontend

- Angular


## Infraestructura

- Docker
- Docker Compose
- PostgreSQL 16
- MailHog



---

# ⚙️ Requisitos


Antes de ejecutar el proyecto debes tener instalado:


- Docker Desktop
- Java 21
- Maven
- Node.js
- Angular CLI



---

# 🐳 Ejecución del proyecto con Docker


Desde la raíz del proyecto ejecutar:


```bash
docker compose up -d

Esto iniciará los siguientes servicios:

Servicio	Puerto
Backend API	8080
PostgreSQL	5433
MailHog SMTP	1025
MailHog Web	8025

Verificar que los contenedores estén ejecutándose:

docker ps
🛑 Detener servicios

Para detener el ambiente:

docker compose down
🔧 Reconstrucción del backend

Después de realizar cambios en el backend:

docker compose down

docker compose build --no-cache

docker compose up -d
🔐 Autenticación JWT

El sistema utiliza autenticación basada en JSON Web Token (JWT).

Login

Endpoint:

POST /api/auth/login

URL:

http://localhost:8080/api/auth/login

Body:

{
    "email": "mauricio@test.com",
    "password": "123456"
}

Respuesta esperada:

{
    "token": "JWT_TOKEN",
    "userId": 1,
    "name": "Mauricio",
    "email": "mauricio@test.com"
}

Para consumir endpoints protegidos se debe enviar:

Authorization: Bearer TOKEN
🌐 Configuración CORS

El backend permite solicitudes desde el frontend Angular:

http://localhost:4200

Métodos habilitados:

GET
POST
PUT
DELETE
OPTIONS
📚 Endpoints principales
Authentication
Login usuario
POST /api/auth/login
📖 Books
Obtener libros
GET /api/books
Crear libro
POST /api/books
Actualizar libro
PUT /api/books/{id}
Eliminar libro
DELETE /api/books/{id}
📚 Loans
Crear préstamo
POST /api/loans
Consultar préstamos del usuario
GET /api/loans/my
📌 Reservations
Crear reserva
POST /api/reservations
🧪 Pruebas realizadas

Durante la validación del proyecto se realizaron las siguientes pruebas:

✅ Levantamiento completo del ambiente mediante Docker Compose.

✅ Verificación del backend Spring Boot ejecutándose correctamente.

✅ Validación de conexión con PostgreSQL.

✅ Validación del servicio MailHog.

✅ Prueba de autenticación mediante login.

✅ Generación y validación de token JWT.

✅ Validación de configuración CORS.

✅ Prueba de consumo de endpoints protegidos mediante Authorization Bearer Token.

✅ Validación de comunicación inicial entre frontend Angular y backend.

🖥️ Frontend Angular

El frontend se encuentra incluido dentro del repositorio.

Para ejecutarlo:

cd frontend

npm install

ng serve

Disponible en:

http://localhost:4200
Nota sobre pruebas del frontend

El frontend fue integrado dentro del repositorio y configurado para comunicarse con el backend.

La validación funcional principal fue realizada directamente sobre la API REST mediante solicitudes HTTP, debido a que el alcance principal de las pruebas estuvo enfocado en la validación del backend.

📧 MailHog

MailHog permite visualizar los correos enviados durante las pruebas.

Panel web:

http://localhost:8025

Servidor SMTP:

localhost:1025
📂 Variables y configuración

Por seguridad, los archivos con información sensible no deben incluirse en el repositorio.

Archivos excluidos:

.env

backend/src/main/resources/application.properties

backend/target/

frontend/node_modules/

frontend/dist/
✅ Estado del proyecto
Componente	Estado
Backend Spring Boot	✅ Funcionando
Autenticación JWT	✅ Funcionando
CORS	✅ Configurado
PostgreSQL	✅ Funcionando
Docker Compose	✅ Configurado
MailHog	✅ Funcionando
Frontend Angular	✅ Integrado

