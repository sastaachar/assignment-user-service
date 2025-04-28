import { AuthService } from '../../services/authService';
import { UserService } from '../../services/userService';
import jwt from 'jsonwebtoken';

jest.mock('../../services/userService');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserService: jest.Mocked<UserService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUserService = {
      getUserByEmail: jest.fn(),
      verifyPassword: jest.fn(),
    } as unknown as jest.Mocked<UserService>;
    (UserService as jest.Mock).mockImplementation(() => mockUserService);
    authService = new AuthService();
  });

  describe('login', () => {
    it('should return a token for valid credentials', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      const mockToken = 'mock.jwt.token';
      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockUserService.verifyPassword.mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(mockToken);

      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const response = await authService.login(loginData);

      expect(mockUserService.getUserByEmail).toHaveBeenCalledWith(loginData.email);
      expect(mockUserService.verifyPassword).toHaveBeenCalledWith(
        loginData.password,
        mockUser.password
      );
      expect(response).toEqual({
        token: mockToken,
        expiresIn: 3600,
      });
    });

    it('should throw error for invalid email', async () => {
      mockUserService.getUserByEmail.mockResolvedValue(null);

      const loginData = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      await expect(authService.login(loginData)).rejects.toThrow('Invalid email or password');
    });

    it('should throw error for invalid password', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'user',
      };

      mockUserService.getUserByEmail.mockResolvedValue(mockUser);
      mockUserService.verifyPassword.mockResolvedValue(false);

      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      await expect(authService.login(loginData)).rejects.toThrow('Invalid email or password');
    });
  });
}); 