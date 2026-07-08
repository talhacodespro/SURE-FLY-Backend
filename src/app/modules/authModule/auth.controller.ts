import httpStatus from 'http-status';
import catchAsync from '@/app/utils/asyncCatch';
import { Request, RequestHandler, Response } from 'express';
import sendResponse from '@/app/utils/sendResponse';
import AuthService from './auth.service';

const authLogin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await AuthService.authLogin(req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User logged in successfully',
      data: result,
    });
  },
);

const authMe: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    const result = await AuthService.authMe(token);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User profile',
      data: result,
    });
  },
);

const AuthController = {
  authLogin,
  authMe,
};

export default AuthController;
