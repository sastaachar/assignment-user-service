import { PrismaClient } from '@prisma/client';

class DbService {
  private static instance: DbService;
  private prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient();
  }

  public static getInstance(): DbService {
    if (!DbService.instance) {
      DbService.instance = new DbService();
    }
    return DbService.instance;
  }

  public getPrisma(): PrismaClient {
    return this.prisma;
  }

  public async disconnect(): Promise<void> {
    await this.prisma.$disconnect();
  }

  public async connect(): Promise<void> {
    await this.prisma.$connect();
  }
}

export const dbService = DbService.getInstance(); 