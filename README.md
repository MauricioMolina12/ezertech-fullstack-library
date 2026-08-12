# Library Management System

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

# Estructura del proyecto

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

🚀 Tecnologías utilizadas
Backend
Java 21
Spring Boot
Spring Security
JWT Authentication
Spring Data JPA
Hibernate
Maven
PostgreSQL
Spring Scheduler
Frontend
Angular
TypeScript
HTML
SCSS
Infraestructura
Docker
Docker Compose
PostgreSQL 16
MailHog


Requisitos

Antes de ejecutar el proyecto debes tener instalado:

Docker Desktop
Node.js
Angular CLI

Para ejecutar el backend directamente fuera de Docker también se requiere:

Java 21
Maven

Ejecución con Docker

Desde la raíz del proyecto:

docker compose up -d

Esto iniciará los servicios configurados en docker-compose.yaml.

Servicios
Servicio	Puerto
Frontend Angular	4200
Backend API	8080
PostgreSQL	5433
MailHog SMTP	1025
MailHog Web	8025

Verificar los contenedores:

docker ps
Detener los servicios

Para detener el ambiente:

docker compose down
Reconstrucción del proyecto

Después de realizar cambios en el backend o frontend:

docker compose down
docker compose build --no-cache
docker compose up -d

También es posible levantar y reconstruir directamente mediante:

docker compose up -d --build
Frontend Angular

El frontend se encuentra incluido dentro del repositorio y está integrado con el backend.

Para ejecutarlo directamente fuera de Docker:

cd frontend
npm install
ng serve

Disponible en:

http://localhost:4200

El frontend permite interactuar con las funcionalidades principales del sistema, incluyendo autenticación, consulta de libros, gestión de préstamos y reservas.

Autenticación JWT

El sistema utiliza autenticación basada en JSON Web Token (JWT).

Login
Endpoint
POST /api/auth/login
URL
http://localhost:8080/api/auth/login
Body
{
    "email": "mauricio@test.com",
    "password": "123456"
}
Respuesta
{
    "token": "JWT_TOKEN",
    "userId": 1,
    "name": "Mauricio",
    "email": "mauricio@test.com"
}

Los endpoints protegidos requieren enviar el token mediante el header:

Authorization: Bearer TOKEN
Seguridad

La seguridad de la API está implementada utilizando Spring Security y JWT.

El flujo de autenticación es:

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

Las rutas de autenticación son públicas:

/api/auth/**

El resto de endpoints requiere autenticación.

Las contraseñas se almacenan utilizando BCryptPasswordEncoder.

Configuración CORS

El backend permite solicitudes provenientes del frontend Angular:

http://localhost:4200

Métodos habilitados:

GET
POST
PUT
DELETE
OPTIONS

Endpoints principales
Authentication
Método	Endpoint	Descripción
POST	/api/auth/login	Iniciar sesión
POST	/api/auth/register	Registrar usuario


Books
Método	Endpoint	Descripción
GET	/api/books	Obtener libros
POST	/api/books	Crear libro
PUT	/api/books/{id}	Actualizar libro
DELETE	/api/books/{id}	Eliminar libro


Loans
Método	Endpoint	Descripción
POST	/api/loans	Crear préstamo
GET	/api/loans/my	Consultar préstamos del usuario
PUT	/api/loans/{id}/return	Devolver un libro


Reservations
Método	Endpoint	Descripción
POST	/api/reservations	Crear reserva


Gestión automática de préstamos

El backend utiliza Spring Scheduler para ejecutar periódicamente procesos relacionados con los préstamos.

La aplicación revisa automáticamente los préstamos activos y realiza las siguientes acciones:


Recordatorios de vencimiento

Se revisan los préstamos cuyo vencimiento se encuentra dentro del período configurado.

Actualmente se utiliza una ventana de:

2 días

Cuando un préstamo entra en esta ventana, se procesa el recordatorio y se evita enviarlo nuevamente mediante reminderSentAt.

Flujo:

Préstamo ACTIVE
      ↓
Faltan hasta 2 días
      ↓
Scheduler
      ↓
Recordatorio
      ↓
reminderSentAt
⚠️ Préstamos vencidos

El scheduler también revisa los préstamos activos cuya fecha de vencimiento ya pasó.

Cuando un préstamo realmente está vencido:

ACTIVE
  ↓
Fecha de vencimiento superada
  ↓
OVERDUE

Se envía un correo al usuario y se registra la fecha del aviso mediante:

overdueNoticeSentAt

Esto evita enviar múltiples notificaciones por el mismo vencimiento.

🚫 Control de atrasos y bloqueo de usuarios

Cuando un usuario devuelve un libro después de la fecha límite, se registra un atraso.

El sistema mantiene en el usuario:

late_returns

para llevar el conteo de atrasos.

Cuando el usuario alcanza tres atrasos dentro del período definido por la lógica del sistema, su cuenta puede quedar bloqueada temporalmente mediante:

blocked_until

Durante el período de bloqueo no puede solicitar nuevos préstamos.

📧 Notificaciones por correo

Los correos son gestionados mediante MailHog durante el entorno de desarrollo.

Actualmente se utilizan notificaciones para eventos relacionados con los préstamos, incluyendo:

Recordatorios de vencimiento.
Avisos de préstamos vencidos.
📬 MailHog

MailHog permite visualizar los correos enviados por el backend durante las pruebas.

Panel web:

http://localhost:8025

Servidor SMTP:

localhost:1025

Ejemplo del flujo:

Spring Boot
    ↓
EmailService
    ↓
SMTP
    ↓
MailHog
    ↓
http://localhost:8025
🗄️ Base de datos

El proyecto utiliza PostgreSQL 16.

Desde Docker, PostgreSQL se expone mediante:

localhost:5433

Mientras que internamente el contenedor utiliza:

5432

Las modificaciones relacionadas con la gestión de atrasos y bloqueos se encuentran registradas mediante scripts SQL de migración.

🧪 Pruebas realizadas

Durante la validación del proyecto se realizaron pruebas de:

✅ Levantamiento completo del ambiente mediante Docker Compose.
✅ Ejecución del backend Spring Boot.
✅ Conexión entre Spring Boot y PostgreSQL.
✅ Funcionamiento de MailHog.
✅ Registro de usuarios.
✅ Login de usuarios.
✅ Generación de tokens JWT.
✅ Validación de tokens JWT.
✅ Protección de endpoints mediante Spring Security.
✅ Configuración CORS.
✅ Comunicación entre frontend Angular y backend.
✅ Consulta de libros.
✅ Creación de préstamos.
✅ Consulta de préstamos.
✅ Devolución de libros.
✅ Creación de reservas.
✅ Ejecución de tareas programadas.
✅ Recordatorios automáticos de vencimiento.
✅ Detección automática de préstamos vencidos.
✅ Envío de correos de préstamos vencidos.
✅ Cambio automático del estado del préstamo a OVERDUE.
✅ Registro de atrasos del usuario.
✅ Gestión de bloqueo temporal de usuarios.



📂 Variables y configuración

Por seguridad, los archivos que contienen información sensible no deben incluirse en el repositorio.

Archivos y directorios excluidos:

.env
backend/src/main/resources/application.properties
backend/target/
frontend/node_modules/
frontend/dist/

Las credenciales, secretos JWT y demás configuraciones sensibles deben mantenerse fuera del repositorio.

📊 Estado del proyecto
Componente	Estado
Backend Spring Boot	✅ Funcionando
Frontend Angular	✅ Funcionando
Autenticación JWT	✅ Funcionando
Spring Security	✅ Configurado
CORS	✅ Configurado
PostgreSQL	✅ Funcionando
Docker Compose	✅ Configurado
MailHog	✅ Funcionando
Gestión de libros	✅ Funcionando
Gestión de préstamos	✅ Funcionando
Devolución de libros	✅ Funcionando
Reservas	✅ Funcionando
Scheduler	✅ Funcionando
Recordatorios automáticos	✅ Funcionando
Detección de vencimientos	✅ Funcionando
Registro de atrasos	✅ Funcionando
Bloqueo temporal	✅ Implementado


🚀 Ejecución rápida

Para levantar todo el proyecto:

docker compose up -d --build

Luego acceder a:

Frontend:
http://localhost:4200

Backend:
http://localhost:8080

MailHog:
http://localhost:8025

Para detener los servicios:

docker compose down