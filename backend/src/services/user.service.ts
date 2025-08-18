import prisma from '../utils/prisma';

interface CreateUserInput {
  email: string;
  password: string;
  role?: 'USER' | 'ADMIN';
}

export const createUser = async ({ email, password, role = 'USER' }: CreateUserInput) => {
  return prisma.user.create({
    data: { email, password, role },
  });
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};