import prisma from '@/app/lib/prisma';
import type { PaymentMethod } from '@/generated/client';
import type { PaymentMethodUncheckedCreateInput } from '@/generated/models';

const getTransactions = async (query?: string) => {
  return prisma.transaction.findMany({
    include: {
      company: true,
      createdBy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const getTransactionById = async (id: number) => {
  return prisma.transaction.findUnique({
    where: { id },
    include: {
      company: true,
      sale: true,
      createdBy: true,
    },
  });
};

const createPaymentMethod = async (
  payload: PaymentMethodUncheckedCreateInput,
) => {
  return prisma.paymentMethod.create({
    data: payload,
  });
};

const getPaymentMethods = async () => {
  return prisma.paymentMethod.findMany();
};

const TransactionService = {
  getTransactions,
  getTransactionById,
  createPaymentMethod,
  getPaymentMethods,
};

export default TransactionService;
