import httpStatus from 'http-status';
import catchAsync from '@/app/utils/asyncCatch';
import type { Request, Response } from 'express';
import { ExpenseService } from './expense.service';
import sendResponse from '@/app/utils/sendResponse';

const createExpenseCategory = catchAsync(
  async (req: Request, res: Response) => {
    const result = await ExpenseService.createExpenseCategory(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Expense category created successfully',
      data: result,
    });
  },
);

const getExpenseCategories = catchAsync(async (req: Request, res: Response) => {
  const result = await ExpenseService.getExpenseCategories(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Expense categories retrieved successfully',
    data: result,
  });
});

export const ExpenseController = {
  createExpenseCategory,
  getExpenseCategories,
};
