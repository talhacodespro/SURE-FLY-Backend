import { Request, Response, NextFunction, RequestHandler } from 'express';
import httpStatus from 'http-status';
import AppError from '@/app/errors/AppError';
import config from '@/app/config';
import { verifyJsonWebToken } from '@/app/lib';
import prisma from '@/app/lib/prisma';
import type { UserRole } from '@/generated/enums';

/**
 * Extract Bearer token from Authorization header
 */
const getTokenFromHeader = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  if (!authHeader.startsWith('Bearer ')) return null;

  return authHeader.slice(7);
};

const requireAuth =
  (...roles: UserRole[]): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // 1️⃣ Get token
      const token = getTokenFromHeader(req);
      if (!token) {
        return next(new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }

      // 2️⃣ Verify token
      const payload = verifyJsonWebToken<{
        sub: number;
        email: string;
      }>(token, String(config.JWT_SECRET));

      if (!payload?.sub) {
        return next(new AppError(httpStatus.UNAUTHORIZED, 'Invalid token'));
      }

      // 3️⃣ Find user (select only safe fields)
      const user = await prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      if (!user) {
        return next(new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized'));
      }

      // 4️⃣ Check active status
      if (!user.isActive) {
        return next(new AppError(httpStatus.FORBIDDEN, 'Inactive account'));
      }

      // 5️⃣ Role-based access control
      if (roles.length && !roles.includes(user.role)) {
        return next(new AppError(httpStatus.FORBIDDEN, 'Forbidden'));
      }

      // 6️⃣ Attach user to response locals
      res.locals.user = user;

      next();
    } catch (error) {
      next(
        error instanceof AppError
          ? error
          : new AppError(httpStatus.UNAUTHORIZED, 'Invalid or expired token'),
      );
    }
  };

export default requireAuth;
