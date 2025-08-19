# Task Management Backend

A full-stack task management system backend built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features
- User registration and login with JWT authentication
- User roles (USER, ADMIN)
- CRUD operations for users and tasks
- Task assignment to users
- Filtering, sorting, and pagination for tasks
- Automated tests with Jest
- Dockerized PostgreSQL database

## Tech Stack
- Node.js, Express, TypeScript
- Prisma ORM
- PostgreSQL (Dockerized)
- Jest (testing)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm
- Docker & Docker Compose

### Setup
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd backend
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update values as needed (especially `DATABASE_URL` and `JWT_SECRET`).
4. **Start PostgreSQL with Docker Compose:**
   ```sh
   docker-compose up -d
   ```
5. **Run Prisma migrations:**
   ```sh
   npx prisma migrate dev --name init
   ```
6. **Generate Prisma client:**
   ```sh
   npx prisma generate
   ```
7. **Start the backend in development mode:**
   ```sh
   npm run dev
   ```

### Running Tests
```sh
npm test
```

## Project Structure
```
src/
  controllers/      # Route handlers
  middlewares/      # Auth & authorization logic
  routers/          # Express routers
  services/         # Business logic
  utils/            # Helpers (e.g., Prisma client)
  tests/            # Unit/integration tests
prisma/
  schema.prisma     # Prisma schema
  migrations/       # DB migrations
```


## API Documentation

### User Endpoints

#### Register
`POST /api/users/register`
**Request Body:**
```json
{
   "email": "user@example.com",
   "password": "yourpassword",
   "role": "USER" // or "ADMIN"
}
```

#### Login
`POST /api/users/login`
**Request Body:**
```json
{
   "email": "user@example.com",
   "password": "yourpassword"
}
```

### Task Endpoints

> All task endpoints require JWT authentication in the `Authorization` header: `Bearer <token>`

#### Create Task
`POST /api/tasks`
**Request Body:**
```json
{
   "title": "Task Title",
   "description": "Task description",
   "status": "PENDING", // or "IN_PROGRESS", "COMPLETED"
   "priority": "MEDIUM", // or "LOW", "HIGH"
   "dueDate": "2025-08-31T23:59:59.000Z",
   "assignedToId": 1
}
```

#### Get All Tasks
`GET /api/tasks`
**Query Parameters (optional):**
`status`, `priority`, `dueDate`, `sortBy`, `sortOrder`, `page`, `pageSize`

#### Get Task by ID
`GET /api/tasks/:id`

#### Update Task
`PUT /api/tasks/:id`
**Request Body:** (any updatable fields)
```json
{
   "title": "Updated Title",
   "status": "IN_PROGRESS"
}
```

#### Delete Task
`DELETE /api/tasks/:id`

---
More endpoints (file upload, document retrieval, etc.) will be documented as they are implemented.

## License
MIT
