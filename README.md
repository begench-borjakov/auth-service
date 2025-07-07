Auth Service — NestJS Backend API

A robust authentication and user management backend built with NestJS, MongoDB, and JWT. This service supports registration, login, token refresh, role-based access control, and user management.

📁 Project Structure :

src/
├── auth/ # Authentication logic (JWT, guards, decorators, tokens)
│ ├── dto/
│ ├── rto/
│ ├── token/
│ ├── jwt/
│ ├── decorators/
│ ├── guards/
│ ├── auth.controller.ts
│ ├── auth.service.ts
│
├── users/ # Users module (CRUD for users)
│ ├── dto/
│ ├── rto/
│ ├── mappers/
│ ├── users.controller.ts
│ ├── users.service.ts
│
├── roles/ # Role and permission management
│ ├── dto/
│ ├── rto/
│ ├── mappers/
│ ├── roles.controller.ts
│ ├── roles.service.ts
│
├── common/ # Shared utilities and infrastructure
│ ├── logger/
│ ├── exceptions/
│ ├── pipes/
│ ├── utils/
│ ├── interceptors/
│
├── database/ # MongoDB schemas, interfaces, repositories
│ ├── user/
│ ├── role/
│
├── main.ts # Application entry point
├── app.module.ts # Root application module

🚀 Features :

✅ User registration and login

✅ JWT-based authentication (access + refresh tokens)

✅ Role-based authorization (admin/user)

✅ Current user info via GET /auth/me

✅ CRUD operations for users and roles

✅ Guards for auth, roles, and resource ownership

✅ Custom pipes and centralized exception handling

✅ Logging with custom AppLogger

✅ Swagger API documentation

🔧 Installation

    npm install

▶️ Run the app :

# development

npm run start

# development with hot reload

npm run start:dev

# production

npm run start:prod

✅ API Documentation (Swagger)

Available at: http://localhost:3000/api
Includes full route descriptions, DTO models, and response formats.

📂 Environment

Create a .env file in the root:
PORT=3000
MONGODB_URI=mongodb://localhost:27017/auth-service
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d

🧪 Testing

# unit tests

npm run test

# e2e tests

npm run test:e2e

# test coverage

npm run test:cov

🛡️ Lint and Formatting
npm run lint
npm run format

📁 .gitignore includes

/node_modules
/dist
/.env
/coverage
/.vscode
/logs
\*.log

🔗 Useful Links

- NestJS Docs

- Swagger UI

- MongoDB

📜 License

MIT © 2025 Begench Borjakov
