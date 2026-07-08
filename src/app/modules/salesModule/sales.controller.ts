import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '@/app/utils/sendResponse';
import catchAsync from '@/app/utils/asyncCatch';
import SalesService from './sales.service';

const createSale: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = res.locals.user?.id as number;
    const result = await SalesService.createSale(req.body, id);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Sale created successfully',
      data: result,
    });
  },
);

const getSales: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await SalesService.getSales();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sales fetched successfully',
      data: result,
    });
  },
);

const getSaleById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SalesService.getSaleById(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sale fetched successfully',
      data: result,
    });
  },
);

const updateSale: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SalesService.updateSale(Number(id), req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sale updated successfully',
      data: result,
    });
  },
);

const deleteSale: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await SalesService.deleteSale(Number(id));
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Sale deleted successfully',
      data: result,
    });
  },
);

const SalesController = {
  createSale,
  getSales,
  getSaleById,
  updateSale,
  deleteSale,
};

export default SalesController;
