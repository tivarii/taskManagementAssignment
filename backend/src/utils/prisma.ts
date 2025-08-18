import { PrismaClient } from '@prisma/client';

class PrismaManager {
    private static instance: PrismaManager;
    private prisma: PrismaClient;

    private constructor() {
        this.prisma = new PrismaClient();
    }

    public static getInstance(): PrismaManager {
        if (!PrismaManager.instance) {
            PrismaManager.instance = new PrismaManager();
        }
        return PrismaManager.instance;
    }

    public getClient(): PrismaClient {
        return this.prisma;
    }

    public async disconnect(): Promise<void> {
        await this.prisma.$disconnect();
    }
}

// Export a function to get the Prisma client instance
export const getPrismaClient = (): PrismaClient => {
    return PrismaManager.getInstance().getClient();
};

// Export the singleton instance for direct access when needed
export default PrismaManager.getInstance().getClient();