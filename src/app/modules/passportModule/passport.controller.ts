import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '@/app/utils/asyncCatch';
import sendResponse from '@/app/utils/sendResponse';
import { PassportService } from './passport.service';

const createPassport = catchAsync(async (req: Request, res: Response) => {
  const id = res.locals.user?.id || 0;
  const result = await PassportService.createPassport(req.body, id);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'Passport created successfully',
    data: result,
  });
});

const getPassports = catchAsync(async (req: Request, res: Response) => {
  const result = await PassportService.getPassports(req.query.query as string);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Passports fetched successfully',
    data: result,
  });
});

const searchPassports = catchAsync(async (req: Request, res: Response) => {
  const result = await PassportService.searchPassports();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Passports searched successfully',
    data: result,
  });
});

const getPassportById = catchAsync(async (req: Request, res: Response) => {
  const result = await PassportService.getPassportById(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Passport fetched successfully',
    data: result,
  });
});

const updatePassport = catchAsync(async (req: Request, res: Response) => {
  const result = await PassportService.updatePassport(
    Number(req.params.id),
    req.body,
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Passport updated successfully',
    data: result,
  });
});

const deletePassport = catchAsync(async (req: Request, res: Response) => {
  await PassportService.deletePassport(Number(req.params.id));
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Passport deleted successfully',
    data: null,
  });
});

export const PassportController = {
  createPassport,
  getPassports,
  searchPassports,
  getPassportById,
  updatePassport,
  deletePassport,
};
