import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import { authRouter } from './controllers/authController';
import { userRouter } from './controllers/userController';
import { authenticate, isAdmin } from './middleware/auth';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import { HttpError, NotFoundError, ErrorResponse } from './utils/errors';

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

// Security headers
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Auth routes
app.use('/api/auth', authRouter);

// User routes
app.use('/api/user', authenticate, userRouter);

// Admin routes
app.use('/api/admin', authenticate, isAdmin, userRouter);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new NotFoundError(`Route ${req.method} ${req.path} not found`));
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  const errorResponse: ErrorResponse = {
    error: {
      message: err.message,
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: req.path,
    },
  };

  if (err instanceof HttpError) {
    errorResponse.error = {
      ...errorResponse.error,
      message: err.message,
      statusCode: err.statusCode,
      code: err.code,
      details: err.details,
    };
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    errorResponse.error.statusCode = 400;
    errorResponse.error.code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    errorResponse.error.statusCode = 401;
    errorResponse.error.code = 'UNAUTHORIZED';
  } else if (err.name === 'ForbiddenError') {
    errorResponse.error.statusCode = 403;
    errorResponse.error.code = 'FORBIDDEN';
  } else if (err.name === 'NotFoundError') {
    errorResponse.error.statusCode = 404;
    errorResponse.error.code = 'NOT_FOUND';
  } else if (err.name === 'ConflictError') {
    errorResponse.error.statusCode = 409;
    errorResponse.error.code = 'CONFLICT';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && !(err instanceof HttpError)) {
    errorResponse.error.message = 'Internal server error';
    errorResponse.error.details = undefined;
  }

  res.status(errorResponse.error.statusCode).json(errorResponse);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app; 