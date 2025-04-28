import jwt from 'jsonwebtoken';
import { UserService } from './userService';
import { LoginInput, AuthResponse, JwtPayload } from '../types';

export class AuthService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await this.userService.getUserByEmail(data.email);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isValidPassword = await this.userService.verifyPassword(
      data.password,
      user.password
    );

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    const payload: JwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    return {
      token,
      expiresIn: 3600, // 1 hour in seconds
    };
  }
} 