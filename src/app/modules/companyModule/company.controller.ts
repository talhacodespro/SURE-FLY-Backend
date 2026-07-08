import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '@/app/utils/sendResponse';
import catchAsync from '@/app/utils/asyncCatch';
import CompanyService from './company.service';

const createCompany: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = res.locals.user?.id || 0;

    const result = await CompanyService.createCompany(req.body, id);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'Company created successfully',
      data: result,
    });
  },
);

const getCompanies: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const query = (req.query.query as string) || '';
    const result = await CompanyService.getCompanies(query);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Companies fetched successfully',
      data: result,
    });
  },
);

const searchCompanies: RequestHandler = catchAsync(
  async (_req: Request, res: Response) => {
    const result = await CompanyService.searchCompanies();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Companies fetched successfully',
      data: result,
    });
  },
);

const getCompanyById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await CompanyService.getCompanyById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Company fetched successfully',
      data: result,
    });
  },
);

const updateCompany: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await CompanyService.updateCompany(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Company updated successfully',
      data: result,
    });
  },
);

const deleteCompany: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    console.log(id);
    const result = await CompanyService.deleteCompany(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Company deleted successfully',
      data: result,
    });
  },
);

const getCompanyBalance: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await CompanyService.getCompanyBalance(id);
    console.log(result);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Company balance fetched successfully',
      data: result,
    });
  },
);

const CompanyController = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
  searchCompanies,
  getCompanyBalance,
};

export default CompanyController;
