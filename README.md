# User Service API – Gym Buddy Application

A TypeScript-based REST API for user management in the Gym Buddy application.

## Features

- User registration and authentication
- JWT-based authentication
- User profile management
- Admin user management
- PostgreSQL database with Prisma ORM

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the database:

   - Create a PostgreSQL database
   - Update the `.env` file with your database connection string:
     ```
     DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
     JWT_SECRET="your-secret-key"
     JWT_EXPIRES_IN="1h"
     ```

4. Run database migrations:

   ```bash
   npm run prisma:migrate
   ```

5. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

## Running the Application

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm run build
npm start
```

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## API Documentation

### Authentication

#### POST /api/auth/token

Authenticate a user and get a JWT token.

Request:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 3600
}
```

### User Management

#### POST /api/user/register

Register a new user.

Request:

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "StrongPassword123"
}
```

#### GET /api/user/me

Get the current user's profile (requires authentication).

#### POST /api/user/update

Update the current user's profile (requires authentication).

Request:

```json
{
  "name": "John D. Doe"
}
```

#### POST /api/user/delete

Delete the current user's account (requires authentication).

### Admin Endpoints

#### GET /api/admin/users

Get a list of all users (requires admin role).

## Database Schema

The application uses the following database schema:

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      String   @default("user")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## License

ISC

1. User Model
   Example:
   { "id": 1,
   "name": "John Doe",
   "email": "john@example.com",
   "role": "user"
   }
   Fields:
   id: integer (unique identifier)

name: string

email: string (must be unique)

role: string (e.g., "user", "admin")

2. Authentication API
   POST /api/auth/token
   Returns a JWT token if credentials are correct. Required for all subsequent API calls.
   Request:
   { "email": "john@example.com",
   "password": "password123"
   }
   Response (200 OK):
   { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
   "expiresIn": 3600
   }
   Response (401 Unauthorized):
   { "error": "Invalid email or password"
   }

Authentication Header (Required for all endpoints below)
Authorization: Bearer <JWT_TOKEN>

3. User APIs (🔐 Requires Token)

POST /api/user/register
Register a new user.
Request:
{ "name": "Jane Smith",
"email": "jane@example.com",
"password": "StrongPassword123"
}
Response:
{ "id": 2,
"name": "Jane Smith",
"email": "jane@example.com",
"role": "user"
}

GET /api/user/me
Get the currently authenticated user's profile.
Response:
{ "id": 2,
"name": "Jane Smith",
"email": "jane@example.com",
"role": "user"
}

POST /api/user/update
Update the current user's profile.
Request:
{ "name": "Jane S. Smith"
}
Response:
{ "id": 2,
"name": "Jane S. Smith",
"email": "jane@example.com",
"role": "user"
}

POST /api/user/delete
Delete the currently authenticated user's own account.
Request:
{}
(No body required — the token identifies the user.)
Response:
{ "message": "User account deleted successfully."
}

4. Admin APIs (🔐 Requires Admin Role)

GET /api/admin/users
Get a list of all users.
Response:
[ { "id": 1,
"name": "John Doe",
"email": "john@example.com",
"role": "user"
}, { "id": 2,
"name": "Jane Smith",
"email": "jane@example.com",
"role": "user"
} ]
