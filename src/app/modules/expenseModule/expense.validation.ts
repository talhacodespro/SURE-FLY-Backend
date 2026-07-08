import z from 'zod';

export const createExpenseCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Expense category name is required')
    .transform((val) => val.trim().toUpperCase()),
  remarks: z.string(),
});
