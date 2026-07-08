import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '@/app/utils/asyncCatch';
import sendResponse from '@/app/utils/sendResponse';
import TransactionService from './transaction.service';

const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getTransactions(
    req.query.query as string,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transactions fetched successfully',
    data: result,
  });
});

const getTransactionById = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getTransactionById(
    Number(req.params.id),
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Transaction fetched successfully',
    data: result,
  });
});

const createPaymentMethod = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.createPaymentMethod(req.body);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment method created successfully',
    data: result,
  });
});

const getPaymentMethods = catchAsync(async (req: Request, res: Response) => {
  const result = await TransactionService.getPaymentMethods();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Payment methods fetched successfully',
    data: result,
  });
});

const TransactionController = {
  getTransactions,
  getTransactionById,
  createPaymentMethod,
  getPaymentMethods,
};

export default TransactionController;
