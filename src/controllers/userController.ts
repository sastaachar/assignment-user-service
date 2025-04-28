import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { UserCreateInput, UserUpdateInput } from '../types';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const userData: UserCreateInput = req.body;
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error creating user' });
    }
  }

  async getCurrentUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching user' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      const updateData: UserUpdateInput = req.body;
      const user = await this.userService.updateUser(userId, updateData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Error updating user' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        res.status(401).json({ error: 'User not authenticated' });
        return;
      }
      await this.userService.deleteUser(userId);
      res.json({ message: 'User account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Error deleting user' });
    }
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.userService.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Error fetching users' });
    }
  }
} 