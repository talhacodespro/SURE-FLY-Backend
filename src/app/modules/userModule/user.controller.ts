import { Request, RequestHandler, Response } from 'express';
import httpStatus from 'http-status';
import sendResponse from '@/app/utils/sendResponse';
import catchAsync from '@/app/utils/asyncCatch';
import UserService from './user.service';

const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.createUser(req.body);
    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: 'User created successfully',
      data: result,
    });
  },
);

const getUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const result = await UserService.getUsers();
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Users fetched successfully',
      data: result,
    });
  },
);

const getUserById: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await UserService.getUserById(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User fetched successfully',
      data: result,
    });
  },
);

const updateUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await UserService.updateUser(id, req.body);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully',
      data: result,
    });
  },
);

const deleteUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const result = await UserService.deleteUser(id);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User deleted successfully',
      data: result,
    });
  },
);

const UserController = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
};

export default UserController;
