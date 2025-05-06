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

## Docker Deployment

The service can be run in a Docker container. Here's how to set it up:

### Using Docker Hub

The service is available on Docker Hub. You can pull and run it directly:

```bash
# Pull the image
docker pull justinmathew/gym-buddy-user-service:latest

# Run the container
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public" \
  -e JWT_SECRET="your-secret-key" \
  -e JWT_EXPIRES_IN="1h" \
  --name gym-buddy-user-service \
  justinmathew/gym-buddy-user-service:latest
```

### Building Locally

1. Build the Docker image:

   ```bash
   docker build -t gym-buddy-user-service .
   ```

2. Run the container:

   ```bash
   docker run -d \
     -p 3000:3000 \
     -e DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public" \
     -e JWT_SECRET="your-secret-key" \
     -e JWT_EXPIRES_IN="1h" \
     --name gym-buddy-user-service \
     gym-buddy-user-service
   ```

3. For development with hot-reload:

   ```bash
   docker run -d \
     -p 3000:3000 \
     -v $(pwd):/app \
     -e NODE_ENV=development \
     -e DATABASE_URL="postgresql://username:password@host:5432/database_name?schema=public" \
     -e JWT_SECRET="your-secret-key" \
     -e JWT_EXPIRES_IN="1h" \
     --name gym-buddy-user-service-dev \
     gym-buddy-user-service
   ```

4. Using Docker Compose (recommended for local development):
   Create a `docker-compose.yml` file:

   ```yaml
   version: "3.8"
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=development
         - DATABASE_URL=postgresql://postgres:postgres@db:5432/gym_buddy?schema=public
         - JWT_SECRET=your-secret-key
         - JWT_EXPIRES_IN=1h
       volumes:
         - .:/app
       depends_on:
         - db

     db:
       image: postgres:15
       environment:
         - POSTGRES_USER=postgres
         - POSTGRES_PASSWORD=postgres
         - POSTGRES_DB=gym_buddy
       ports:
         - "5432:5432"
       volumes:
         - postgres_data:/var/lib/postgresql/data

   volumes:
     postgres_data:
   ```

   Then run:

   ```bash
   docker-compose up -d
   ```

   To run migrations in the container:

   ```bash
   docker-compose exec app npm run prisma:migrate
   ```

### Docker Features

The Docker setup includes:

1. **Multi-stage Build**:

   - Builder stage for compiling TypeScript and generating Prisma client
   - Production stage with only necessary files and dependencies

2. **Development Mode**:

   - Hot-reload support for faster development
   - Volume mounting for live code updates
   - Separate development and production configurations

3. **Database Integration**:

   - PostgreSQL container with persistent storage
   - Automatic database initialization
   - Easy migration management

4. **Environment Configuration**:

   - Secure environment variable handling
   - Configurable JWT settings
   - Database connection management

5. **Health Monitoring**:
   - Health check endpoint at `/health`
   - Container status monitoring
   - Log aggregation support

### Docker Best Practices

1. **Security**:

   - Use environment variables for sensitive data
   - Run as non-root user
   - Keep images updated
   - Use multi-stage builds to minimize attack surface

2. **Performance**:

   - Optimized layer caching
   - Minimal production image size
   - Efficient dependency management

3. **Development**:

   - Hot-reload for faster iteration
   - Consistent development environment
   - Easy database management

4. **Production**:
   - Production-ready configuration
   - Health monitoring
   - Log management
   - Resource optimization

## API Documentation

The API documentation is available through Swagger UI. After starting the application:

1. Visit `http://localhost:3000/api-docs` in your browser
2. You'll see an interactive API documentation page
3. The documentation includes:
   - All available endpoints
   - Request/response schemas
   - Authentication requirements
   - Example requests
   - Response codes and descriptions

To test the API:

1. First, register a new user using the `/api/auth/register` endpoint
2. Then login using the `/api/auth/login` endpoint to get a JWT token
3. Click the "Authorize" button at the top of the page
4. Enter your JWT token in the format: `Bearer your-token-here`
5. You can now test all authenticated endpoints

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
