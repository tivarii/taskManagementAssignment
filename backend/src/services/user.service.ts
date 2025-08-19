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

export const getUser = async (userId: string, requestingUserId: string, userRole: string) => {
  // Admin can get any user, regular users can only get their own data
  if (userRole === 'ADMIN' || userId === requestingUserId) {
    return prisma.user.findUnique({
      where: { id: Number(userId) },
    });
  }
  throw new Error('Unauthorized: You can only access your own data');
};

export const updateUser = async (
  userId: string, 
  requestingUserId: string, 
  userRole: string,
  data: { email?: string; role?: 'USER' | 'ADMIN' }
) => {
  // Admin can update any user, regular users can only update their own data
  if (userRole === 'ADMIN' || userId === requestingUserId) {
    // If regular user tries to change role, prevent it
    if (userRole !== 'ADMIN' && data.role) {
      delete data.role;
    }
    
    return prisma.user.update({
      where: { id: Number(userId) },
      data,
    });
  }
  throw new Error('Unauthorized: You can only update your own data');
};

export const deleteUser = async (userId: string, requestingUserId: string, userRole: string) => {
  // Admin can delete any user, regular users can only delete their own account
  if (userRole === 'ADMIN' || userId === requestingUserId) {
    return prisma.user.delete({
      where: { id: Number(userId) },
    });
  }
  throw new Error('Unauthorized: You can only delete your own account');
};

export const getAllUsers = async (userRole: string) => {
  // Only admins can get all users
  if (userRole === 'ADMIN') {
    return prisma.user.findMany();
  }
  throw new Error('Unauthorized: Only admins can view all users');
};