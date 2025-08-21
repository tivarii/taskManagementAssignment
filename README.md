# Task Management System

## Overview
This is a full-stack web application for task management, built with React (Vite, shadcn/ui, TailwindCSS) for the frontend and Node.js/Express with Prisma/PostgreSQL for the backend. The app supports user authentication, task CRUD, file uploads, and more.

## Project Structure

- `frontend/` — React app (Vite, shadcn/ui, TailwindCSS)
- `backend/` — Node.js/Express API, Prisma ORM
- `docker-compose.yml` — Root-level file to run the entire stack

## Prerequisites
- [Docker](https://www.docker.com/products/docker-desktop) installed

## Quick Start (Docker Compose)

1. Clone the repository:
	```bash
	git clone <your-repo-url>
	cd taskManagementAssignment
	```

2. Build and start all services:
	```bash
	docker-compose up --build
	```

3. The services will be available at:
	- Frontend: http://localhost (port 80)
	- Backend API: http://localhost:4000
	- PostgreSQL: localhost:5432

## Environment Variables

The backend service uses the following environment variables (see `docker-compose.yml`):
- `DATABASE_URL=postgres://taskuser:taskpassword@postgres:5432/taskdb`

You can add more variables as needed in the compose file or `.env` files.

## Development

You can also run frontend and backend locally for development:

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## API Documentation

API documentation is available via Swagger/Postman collection (see backend docs).

## License

MIT
# taskManagementAssignment
