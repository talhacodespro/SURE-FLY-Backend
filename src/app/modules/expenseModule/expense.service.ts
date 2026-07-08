import prisma from '@/app/lib/prisma';
import type {
  ExpenseCategoryUncheckedCreateInput,
  ExpenseUncheckedCreateInput,
} from '@/generated/models';

const createExpenseCategory = async (
  payload: ExpenseCategoryUncheckedCreateInput,
) => {
  const exists = await prisma.expenseCategory.findFirst({
    where: { name: payload.name },
  });
  if (exists) {
    throw new Error('Expense category already exists');
  }

  const result = await prisma.expenseCategory.create({
    data: payload,
  });
  return result;
};

const getExpenseCategories = async (query: Record<string, unknown>) => {
  const fields = String(query.fields || '').split(',');

  return prisma.expenseCategory.findMany({
    select: {
      id: true,
      name: true,
      remarks: fields.includes('remarks'),
      createdAt: fields.includes('createdAt'),
      updatedAt: fields.includes('updatedAt'),
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

const createExpense = async (payload: ExpenseUncheckedCreateInput) => {
  const result = await prisma.expense.create({
    data: payload,
  });
  return result;
};

export const ExpenseService = {
  createExpenseCategory,
  getExpenseCategories,
  createExpense,
};
