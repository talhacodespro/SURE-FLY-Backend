import prisma from '@/app/lib/prisma';
import AppError from '@/app/errors/AppError';
import httpStatus from 'http-status';
import type {
  PassportUncheckedCreateInput,
  PassportUpdateInput,
} from '@/generated/models';

const createPassport = async (
  payload: Omit<PassportUncheckedCreateInput, 'createdById'>,
  createdById: number,
) => {
  const exists = await prisma.passport.findUnique({
    where: { passportNo: payload.passportNo },
  });

  if (exists) {
    throw new AppError(httpStatus.CONFLICT, 'Passport number already exists');
  }

  const result = await prisma.passport.create({
    data: { ...payload, createdById },
  });
  return result;
};

const getPassports = async (query?: string) => {
  return prisma.passport.findMany({
    where: query
      ? {
          OR: [
            { fullName: { contains: query, mode: 'insensitive' } },
            { passportNo: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {},
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const searchPassports = async () => {
  return prisma.passport.findMany({
    select: {
      id: true,
      fullName: true,
      passportNo: true,
    },
  });
};

const getPassportById = async (id: number) => {
  const result = await prisma.passport.findUnique({ where: { id } });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Passport not found');
  }
  return result;
};

const updatePassport = async (id: number, payload: PassportUpdateInput) => {
  const exists = await prisma.passport.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Passport not found');
  }

  if (payload.passportNo) {
    const passportNo =
      typeof payload.passportNo === 'string'
        ? payload.passportNo
        : (payload.passportNo as any).set;
    if (passportNo) {
      const duplicate = await prisma.passport.findFirst({
        where: {
          passportNo: passportNo,
          id: { not: id },
        },
      });
      if (duplicate) {
        throw new AppError(
          httpStatus.CONFLICT,
          'Passport number already exists',
        );
      }
    }
  }

  const result = await prisma.passport.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deletePassport = async (id: number) => {
  const exists = await prisma.passport.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Passport not found');
  }
  return prisma.passport.delete({ where: { id } });
};

export const PassportService = {
  createPassport,
  getPassports,
  searchPassports,
  getPassportById,
  updatePassport,
  deletePassport,
};
