# 📚 Library Management System

Sistema de gestión de biblioteca desarrollado como prueba técnica Full Stack.

La aplicación permite gestionar usuarios, libros, préstamos y reservas mediante una aplicación web construida con Angular y una API REST desarrollada con Spring Boot.

El sistema cuenta con autenticación mediante JWT, persistencia en PostgreSQL, envío de correos mediante MailHog y tareas programadas para gestionar automáticamente recordatorios y préstamos vencidos.

El proyecto está compuesto por:

- Backend desarrollado con Spring Boot.
- Frontend desarrollado con Angular.
- Base de datos PostgreSQL.
- Autenticación mediante JWT.
- Servicio de correo de pruebas mediante MailHog.
- Tareas programadas mediante Spring Scheduler.
- Docker Compose para levantar el ambiente completo.

---

# 🏗️ Estructura del proyecto

```text
ezertech-fullstack-library
│
├── backend
│   ├── src
│   ├── pom.xml
│   └── Dockerfile
│
├── frontend
│   ├── src
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yaml
├── .gitignore
└── README.md
```

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
- Spring Scheduler

## Frontend

- Angular
- TypeScript
- HTML
- SCSS

## Infraestructura

- Docker
- Docker Compose
- PostgreSQL 16
- MailHog
- Nginx

---

# 📋 Requisitos

## Ejecución con Docker

Para ejecutar el proyecto mediante Docker se requiere:

- Docker Desktop

## Ejecución manual

Para ejecutar el frontend fuera de Docker:

- Node.js
- Angular CLI

Para ejecutar el backend fuera de Docker:

- Java 21
- Maven

---

# 🐳 Ejecución con Docker

El proyecto está completamente dockerizado.

Docker Compose se encarga de construir y ejecutar:

- Frontend Angular
- Backend Spring Boot
- PostgreSQL
- MailHog

Desde la raíz del proyecto ejecutar:

```bash
docker compose up -d --build
```

Este comando:

1. Construye la imagen del backend.
2. Construye la aplicación Angular.
3. Genera la imagen del frontend utilizando Nginx.
4. Levanta PostgreSQL.
5. Levanta MailHog.
6. Inicia todos los servicios necesarios para ejecutar la aplicación.

Una vez finalizado el proceso, el sistema estará disponible en:

| Servicio | URL / Puerto |
|---|---|
| Frontend Angular | http://localhost:4200 |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5433 |
| MailHog Web | http://localhost:8025 |
| MailHog SMTP | localhost:1025 |

---

# 🔍 Verificar los contenedores

Para verificar que todos los servicios estén ejecutándose:

```bash
docker ps
```

Se deben encontrar los siguientes contenedores:

```text
library-frontend
library-backend
library-postgres
library-mailhog
```

---

# 🛑 Detener los servicios

Para detener el ambiente:

```bash
docker compose down
```

---

# 🔧 Reconstrucción del proyecto

Después de realizar cambios en el backend o frontend se recomienda reconstruir las imágenes:

```bash
docker compose down
docker compose build --no-cache
docker compose up -d
```

También es posible reconstruir y levantar el ambiente directamente mediante:

```bash
docker compose up -d --build
```

Esto permite que los cambios realizados en el código sean incluidos en las nuevas imágenes de Docker.

---

# 🖥️ Frontend Angular

El frontend se encuentra incluido dentro del repositorio y está integrado con el backend.

## Ejecución mediante Docker

Al ejecutar:

```bash
docker compose up -d --build
```

Docker realiza automáticamente el proceso de construcción del frontend.

El proceso consiste en:

```text
Angular
   ↓
npm build
   ↓
Archivos estáticos
   ↓
Imagen Nginx
   ↓
library-frontend
```

El frontend queda disponible en:

```text
http://localhost:4200
```

No es necesario ejecutar `ng serve` cuando se utiliza Docker Compose.

## Ejecución manual

También es posible ejecutar el frontend directamente fuera de Docker:

```bash
cd frontend
npm install
ng serve
```

Disponible en:

```text
http://localhost:4200
```

---

# 🔐 Autenticación JWT

El sistema utiliza autenticación basada en JSON Web Token (JWT).

## Login

### Endpoint

```http
POST /api/auth/login
```

### URL

```text
http://localhost:8080/api/auth/login
```

### Body

```json
{
    "email": "mauricio@test.com",
    "password": "123456"
}
```

### Respuesta

```json
{
    "token": "JWT_TOKEN",
    "userId": 1,
    "name": "Mauricio",
    "email": "mauricio@test.com"
}
```

Los endpoints protegidos requieren enviar el token mediante el header:

```http
Authorization: Bearer TOKEN
```

---

# 🛡️ Seguridad

La seguridad de la API está implementada utilizando Spring Security y JWT.

El flujo de autenticación es:

```text
Login
  ↓
AuthenticationManager
  ↓
Validación de email y contraseña
  ↓
Generación del JWT
  ↓
Frontend recibe el token
  ↓
Requests protegidas
  ↓
JwtAuthenticationFilter
  ↓
Validación del JWT
  ↓
SecurityContext
  ↓
Controller
```

Las rutas de autenticación son públicas:

```text
/api/auth/**
```

El resto de endpoints requiere autenticación.

Las contraseñas se almacenan utilizando:

```text
BCryptPasswordEncoder
```

---

# 🌐 Configuración CORS

El backend permite solicitudes provenientes del frontend Angular:

```text
http://localhost:4200
```

Métodos habilitados:

```text
GET
POST
PUT
DELETE
OPTIONS
```

---

# 📚 Endpoints principales

## Authentication

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/login` | Iniciar sesión |
| POST | `/api/auth/register` | Registrar usuario |

## Books

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/books` | Obtener libros |
| POST | `/api/books` | Crear libro |
| PUT | `/api/books/{id}` | Actualizar libro |
| DELETE | `/api/books/{id}` | Eliminar libro |

## Loans

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/loans` | Crear préstamo |
| GET | `/api/loans/my` | Consultar préstamos del usuario |
| PUT | `/api/loans/{id}/return` | Devolver un libro |

## Reservations

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/reservations` | Crear reserva |

---

# ⏰ Gestión automática de préstamos

El backend utiliza Spring Scheduler para ejecutar periódicamente procesos relacionados con los préstamos.

La aplicación revisa automáticamente los préstamos activos y realiza las siguientes acciones:

- Recordatorios de vencimiento.
- Detección de préstamos vencidos.
- Envío de notificaciones por correo.
- Cambio automático del estado del préstamo.
- Registro de atrasos.

---

# 🔔 Recordatorios de vencimiento

El sistema revisa los préstamos cuyo vencimiento se encuentra dentro del período configurado.

Actualmente se utiliza una ventana de:

```text
2 días
```

Cuando un préstamo entra en esta ventana, se procesa el recordatorio y se evita enviarlo nuevamente mediante:

```text
reminderSentAt
```

Flujo:

```text
Préstamo ACTIVE
      ↓
Faltan hasta 2 días
      ↓
Scheduler
      ↓
Recordatorio
      ↓
reminderSentAt
```

---

# ⚠️ Préstamos vencidos

El scheduler también revisa los préstamos activos cuya fecha de vencimiento ya pasó.

Cuando un préstamo realmente está vencido:

```text
ACTIVE
  ↓
Fecha de vencimiento superada
  ↓
OVERDUE
```

Se envía un correo al usuario y se registra la fecha del aviso mediante:

```text
overdueNoticeSentAt
```

Esto evita enviar múltiples notificaciones por el mismo vencimiento.

---

# 🚫 Control de atrasos y bloqueo de usuarios

Cuando un usuario devuelve un libro después de la fecha límite, se registra un atraso.

El sistema mantiene en el usuario:

```text
late_returns
```

para llevar el conteo de atrasos.

Cuando el usuario alcanza tres atrasos dentro del período definido por la lógica del sistema, su cuenta queda bloqueada temporalmente mediante:

```text
blocked_until
```

Durante el período de bloqueo no puede solicitar nuevos préstamos.

---

# 📧 Notificaciones por correo

Los correos son gestionados mediante MailHog durante el entorno de desarrollo.

Actualmente se utilizan notificaciones para eventos relacionados con los préstamos:

- Recordatorios de vencimiento.
- Avisos de préstamos vencidos.

---

# 📬 MailHog

MailHog permite visualizar los correos enviados por el backend durante las pruebas.

## Panel web

```text
http://localhost:8025
```

## Servidor SMTP

```text
localhost:1025
```

## Flujo

```text
Spring Boot
    ↓
EmailService
    ↓
SMTP
    ↓
MailHog
    ↓
http://localhost:8025
```

---

# 🗄️ Base de datos

El proyecto utiliza PostgreSQL 16.

Desde Docker, PostgreSQL se expone mediante:

```text
localhost:5433
```

Mientras que internamente el contenedor utiliza:

```text
5432
```

La base de datos utiliza:

```text
Database: library
User: library
```

Las modificaciones relacionadas con la gestión de atrasos y bloqueos se encuentran registradas mediante scripts SQL de migración.

---

# 🧪 Pruebas realizadas

Durante la validación del proyecto se realizaron pruebas de:

- ✅ Levantamiento completo del ambiente mediante Docker Compose.
- ✅ Ejecución del backend Spring Boot.
- ✅ Construcción del frontend Angular mediante Docker.
- ✅ Servir el frontend mediante Nginx.
- ✅ Conexión entre Spring Boot y PostgreSQL.
- ✅ Funcionamiento de MailHog.
- ✅ Registro de usuarios.
- ✅ Login de usuarios.
- ✅ Generación de tokens JWT.
- ✅ Validación de tokens JWT.
- ✅ Protección de endpoints mediante Spring Security.
- ✅ Configuración CORS.
- ✅ Comunicación entre frontend Angular y backend.
- ✅ Consulta de libros.
- ✅ Creación de préstamos.
- ✅ Consulta de préstamos.
- ✅ Devolución de libros.
- ✅ Creación de reservas.
- ✅ Ejecución de tareas programadas.
- ✅ Recordatorios automáticos de vencimiento.
- ✅ Detección automática de préstamos vencidos.
- ✅ Envío de correos de préstamos vencidos.
- ✅ Cambio automático del estado del préstamo a `OVERDUE`.
- ✅ Registro de atrasos del usuario.
- ✅ Gestión de bloqueo temporal de usuarios.

---

# 📂 Variables y configuración

Por seguridad, los archivos que contienen información sensible no deben incluirse en el repositorio.

Archivos y directorios excluidos:

```text
.env
backend/src/main/resources/application.properties
backend/target/
frontend/node_modules/
frontend/dist/
```

Las credenciales, secretos JWT y demás configuraciones sensibles deben mantenerse fuera del repositorio.

---

# 📊 Estado del proyecto

| Componente | Estado |
|---|---|
| Backend Spring Boot | ✅ Funcionando |
| Frontend Angular | ✅ Funcionando |
| Frontend Dockerizado | ✅ Funcionando |
| Nginx | ✅ Configurado |
| Autenticación JWT | ✅ Funcionando |
| Spring Security | ✅ Configurado |
| CORS | ✅ Configurado |
| PostgreSQL | ✅ Funcionando |
| Docker Compose | ✅ Configurado |
| MailHog | ✅ Funcionando |
| Gestión de libros | ✅ Funcionando |
| Gestión de préstamos | ✅ Funcionando |
| Devolución de libros | ✅ Funcionando |
| Reservas | ✅ Funcionando |
| Scheduler | ✅ Funcionando |
| Recordatorios automáticos | ✅ Funcionando |
| Detección de vencimientos | ✅ Funcionando |
| Registro de atrasos | ✅ Funcionando |
| Bloqueo temporal | ✅ Implementado |

---

# 🚀 Ejecución rápida

Para levantar todo el proyecto desde cero:

```bash
docker compose up -d --build
```

Luego acceder a:

### Frontend

```text
http://localhost:4200
```

### Backend

```text
http://localhost:8080
```

### MailHog

```text
http://localhost:8025
```

Para verificar los servicios:

```bash
docker ps
```

Para detener todo:

```bash
docker compose down
```

---

# 👨‍💻 Proyecto

Proyecto desarrollado como prueba técnica Full Stack.

La aplicación integra frontend, backend, autenticación, persistencia, notificaciones por correo, tareas programadas y un entorno completamente dockerizado.