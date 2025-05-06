import jwt, { SignOptions } from 'jsonwebtoken';
import { UserService } from './userService';
import { LoginInput, AuthResponse, JwtPayload, UserCreateInput } from '../types';
import { ValidationError, UnauthorizedError, ConflictError } from '../utils/errors';
import { dbService } from './dbService';

// Create a single instance of UserService
const userService = new UserService(dbService.getPrisma());

interface AuthResponseWithUser extends AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export class AuthService {
  async register(data: UserCreateInput): Promise<AuthResponseWithUser> {
    try {
      // Validate input
      if (!data.email || !data.password || !data.name) {
        throw new ValidationError('Missing required fields', {
          missingFields: {
            name: !data.name,
            email: !data.email,
            password: !data.password
          }
        });
      }

      // Check if user already exists
      const existingUser = await userService.getUserByEmail(data.email);
      if (existingUser) {
        throw new ConflictError('Email already registered');
      }

      // Create new user
      const user = await userService.createUser(data);

      // Generate token for immediate login
      const token = this.generateToken(user.id, user.role);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: token.token,
        expiresIn: token.expiresIn
      };
    } catch (error) {
      throw error;
    }
  }

  async login(data: LoginInput): Promise<AuthResponseWithUser> {
    try {
      // Validate input
      if (!data.email || !data.password) {
        throw new ValidationError('Missing email or password', {
          missingFields: {
            email: !data.email,
            password: !data.password
          }
        });
      }

      const user = await userService.getUserByEmail(data.email);
      if (!user) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const isValidPassword = await userService.verifyPassword(
        data.password,
        user.password
      );

      if (!isValidPassword) {
        throw new UnauthorizedError('Invalid email or password');
      }

      const token = this.generateToken(user.id, user.role);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: token.token,
        expiresIn: token.expiresIn
      };
    } catch (error) {
      throw error;
    }
  }

  private generateToken(userId: number, role: string): { token: string; expiresIn: number } {
    const payload: JwtPayload = {
      userId,
      role,
    };

    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn']
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, options);

    // Convert expiresIn to seconds
    const expiresInSeconds = this.parseExpiresIn(expiresIn);

    return {
      token,
      expiresIn: expiresInSeconds,
    };
  }

  private parseExpiresIn(expiresIn: string): number {
    const unit = expiresIn.slice(-1);
    const value = parseInt(expiresIn.slice(0, -1), 10);

    switch (unit) {
      case 's': return value;
      case 'm': return value * 60;
      case 'h': return value * 60 * 60;
      case 'd': return value * 60 * 60 * 24;
      default: return 3600; // Default to 1 hour
    }
  }
} 