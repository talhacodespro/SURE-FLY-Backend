import prisma from '@/app/lib/prisma';
import AppError from '@/app/errors/AppError';
import httpStatus from 'http-status';
import type {
  CompanyUncheckedCreateInput,
  CompanyUpdateInput,
} from '@/generated/models';

const createCompany = async (
  payload: Omit<CompanyUncheckedCreateInput, 'createdBy'>,
  createdById: number,
) => {
  console.log(payload);
  const exists = await prisma.company.findFirst({
    where: {
      OR: [{ email: payload.email }, { name: payload.name }],
    },
  });
  if (exists) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Company email or name already exists',
    );
  }

  const result = await prisma.company.create({
    data: {
      ...payload,
      createdById,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
  return result;
};

const getCompanies = async (query?: string) => {
  const id = Number(query);

  return prisma.company.findMany({
    where: query && !isNaN(id) ? { id } : {},
  });
};

const searchCompanies = async () => {
  const result = await prisma.company.findMany({
    select: {
      id: true,
      name: true,
    },
  });
  return result;
};

const getCompanyById = async (id: number) => {
  const result = await prisma.company.findUnique({ where: { id } });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company not found');
  }
  return result;
};

const updateCompany = async (id: number, payload: CompanyUpdateInput) => {
  // 1️⃣ Check company exists
  const exists = await prisma.company.findUnique({
    where: { id },
  });

  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company not found');
  }

  // 2️⃣ Check duplicate email or name (exclude current company)
  const duplicate = await prisma.company.findFirst({
    where: {
      AND: [
        { id: { not: id } }, // 🔥 exclude self
        {
          OR: [
            { email: payload.email as string },
            { name: payload.name as string },
          ],
        },
      ],
    },
  });

  if (duplicate) {
    throw new AppError(
      httpStatus.CONFLICT,
      'Company email or name already exists',
    );
  }

  const result = await prisma.company.update({
    where: { id },
    data: payload,
  });
  return result;
};

const deleteCompany = async (id: number) => {
  const exists = await prisma.company.findUnique({ where: { id } });
  if (!exists) {
    throw new AppError(httpStatus.NOT_FOUND, 'Company not found');
  }
  const result = await prisma.company.delete({ where: { id } });
  return result;
};

const getCompanyBalance = async (companyId: number) => {
  const transactions = await prisma.transaction.groupBy({
    where: { companyId },
    by: ['direction'],
    _sum: {
      amount: true,
    },
  });

  const debit =
    transactions.find((t) => t.direction === 'DEBIT')?._sum.amount ?? 0;

  const credit =
    transactions.find((t) => t.direction === 'CREDIT')?._sum.amount ?? 0;

  return {
    debit,
    credit,
    balance: credit - debit,
  };
};

const CompanyService = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  searchCompanies,
  getCompanyBalance,
};

export default CompanyService;
