import express from 'express';
import { ExpenseController } from './expense.controller';
import requireAuth from '@/app/middlewares/requireAuth';
import validateRequest from '@/app/middlewares/validateRequest';
import { createExpenseCategorySchema } from './expense.validation';

const router = express.Router();

router.post(
  '/categories',
  requireAuth(),
  validateRequest(createExpenseCategorySchema),
  ExpenseController.createExpenseCategory,
);

router.get(
  '/categories',
  requireAuth(),
  ExpenseController.getExpenseCategories,
);

export const ExpenseRoutes = router;
