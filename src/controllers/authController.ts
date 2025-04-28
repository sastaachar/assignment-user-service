import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import { LoginInput } from '../types';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginInput = req.body;
      const authResponse = await this.authService.login(loginData);
      res.json(authResponse);
    } catch (error) {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  }
} 