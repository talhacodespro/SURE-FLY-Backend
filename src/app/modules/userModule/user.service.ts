import prisma from '@/app/lib/prisma';
import AppError from '@/app/errors/AppError';
import httpStatus from 'http-status';
import type { UserCreateInput, UserUpdateInput } from '@/generated/models';
import { hashPassword } from '@/app/lib';

const createUser = async (payload: UserCreateInput) => {
  const exists = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'User already exists');
  }
  const result = await prisma.user.create({
    data: {
      ...payload,
      password: await hashPassword(payload.password),
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
    },
  });
  return result;
};

const getUsers = async () => {
  const result = await prisma.user.findMany();
  return result;
};

const getUserById = async (id: number) => {
  const result = await prisma.user.findUnique({ where: { id } });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const updateUser = async (id: number, payload: UserUpdateInput) => {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  console.log(payload);
  const data: Record<string, unknown> = {};
  if (payload.fullName) data.fullName = payload.fullName;
  if (payload.email) data.email = payload.email;
  if (payload.dob) data.dob = payload.dob;
  if (payload.phone) data.phone = payload.phone;
  if (payload.address) data.address = payload.address;
  if (payload.avatar) data.avatar = payload.avatar;

  const result = await prisma.user.update({
    where: { id },
    data: data,
  });
  return result;
};

const deleteUser = async (id: number) => {
  const exists = await prisma.user.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const result = await prisma.user.delete({ where: { id } });
  return result;
};

const UserService = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default UserService;
