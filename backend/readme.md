# Task Management Backend

A full-stack task management system backend built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Features
- User registration and login with JWT authentication
- User roles (USER, ADMIN)
- CRUD operations for users and tasks
- Task assignment to users
- Attach up to 3 PDF documents to tasks
- Filtering, sorting, and pagination for tasks
- File upload, view, and download endpoints
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
**Response:**
```json
{
   "message": "User registered",
   "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
   }
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
**Response:**
```json
{
   "token": "<JWT token>",
   "user": {
      "id": 1,
      "email": "user@example.com",
      "role": "USER"
   }
}
```

#### Get User by ID
`GET /api/users/:id`
**Headers:**
- `Authorization: Bearer <JWT token>`

**Response:**
```json
{
   "id": 1,
   "email": "user@example.com",
   "role": "USER"
}
```

#### Update User by ID
`PUT /api/users/:id`
**Headers:**
- `Authorization: Bearer <JWT token>`

**Request Body:**
```json
{
   "email": "updated@example.com"
}
```

**Response:**
```json
{
   "message": "User updated",
   "user": {
      "id": 1,
      "email": "updated@example.com",
      "role": "USER"
   }
}
```

#### Delete User by ID
`DELETE /api/users/:id`
**Headers:**
- `Authorization: Bearer <JWT token>`

**Response:**
```json
{
   "message": "User deleted"
}
```

#### Get All Users
`GET /api/users`
**Headers:**
- `Authorization: Bearer <JWT token>` (requires ADMIN role)

**Response:**
```json
[
   {
      "id": 1,
      "email": "user1@example.com",
      "role": "USER"
   },
   {
      "id": 2,
      "email": "user2@example.com",
      "role": "ADMIN"
   }
]
```

### Task Endpoints

#### Upload Documents to a Task
`POST /api/tasks/:id/documents`
**Headers:**
- `Authorization: Bearer <JWT token>`
**Form Data:**
- `documents`: Up to 3 PDF files (multipart/form-data)

**Example using curl:**
```sh
curl -X POST http://localhost:4000/api/tasks/1/documents \
   -H "Authorization: Bearer <JWT token>" \
   -F "documents=@/path/to/file1.pdf" \
   -F "documents=@/path/to/file2.pdf"
```

**Response:**
```json
{
   "message": "Files uploaded",
   "documents": [
      {
         "id": 1,
         "fileName": "file1.pdf",
         "filePath": "uploads/162938123-file1.pdf",
         "taskId": 1,
         "uploadedAt": "2025-08-19T12:34:56.000Z"
      }
   ]
}
```

#### View a Document (Inline in Browser)
`GET /api/tasks/documents/:docId/view`
**Headers:**
- `Authorization: Bearer <JWT token>`

**Description:**
Returns the PDF file inline in the browser for viewing.

**Example using curl:**
```sh
curl -X GET http://localhost:4000/api/tasks/documents/1/view \
   -H "Authorization: Bearer <JWT token>"
```

#### Download a Document
`GET /api/tasks/documents/:docId/download`
**Headers:**
- `Authorization: Bearer <JWT token>`

**Description:**
Prompts the user to download the PDF file as an attachment.

**Example using curl:**
```sh
curl -X GET http://localhost:4000/api/tasks/documents/1/download \
   -H "Authorization: Bearer <JWT token>" --output file1.pdf
```

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
