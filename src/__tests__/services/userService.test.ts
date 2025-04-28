import { UserService } from '../../services/userService';
import { PrismaClient } from '@prisma/client';

const mockPrisma = {
  user: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
  },
} as unknown as PrismaClient;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService(mockPrisma);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const user = await userService.createUser(userData);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: userData.name,
          email: userData.email,
        }),
        select: expect.any(Object),
      });
      expect(user).toEqual(mockUser);
    });

    it('should not create a user with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      (mockPrisma.user.create as jest.Mock).mockRejectedValue(new Error('Unique constraint failed'));

      await expect(userService.createUser(userData)).rejects.toThrow();
    });
  });

  describe('getUserById', () => {
    it('should return a user by id', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const user = await userService.getUserById(1);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: expect.any(Object),
      });
      expect(user).toEqual(mockUser);
    });

    it('should return null for non-existent user', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      const user = await userService.getUserById(999);
      expect(user).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user details', async () => {
      const mockUser = {
        id: 1,
        name: 'Updated Name',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      const updatedUser = await userService.updateUser(1, {
        name: 'Updated Name',
      });

      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { name: 'Updated Name' },
        select: expect.any(Object),
      });
      expect(updatedUser).toEqual(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.user.delete as jest.Mock).mockResolvedValue(mockUser);

      await userService.deleteUser(1);

      expect(mockPrisma.user.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });
}); 