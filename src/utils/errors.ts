export class HttpError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found', details?: any) {
    super(404, message, 'NOT_FOUND', details);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends HttpError {
  constructor(message: string = 'Validation failed', details?: any) {
    super(400, message, 'VALIDATION_ERROR', details);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized', details?: any) {
    super(401, message, 'UNAUTHORIZED', details);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden', details?: any) {
    super(403, message, 'FORBIDDEN', details);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Resource conflict', details?: any) {
    super(409, message, 'CONFLICT', details);
    this.name = 'ConflictError';
  }
}

export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    statusCode: number;
    details?: any;
    timestamp: string;
    path?: string;
  };
} 