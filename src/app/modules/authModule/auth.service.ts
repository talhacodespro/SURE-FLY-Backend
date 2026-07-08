import AppError from '@/app/errors/AppError';
import httpStatus from 'http-status';
import config from '@/app/config';
import type { TAuthLogin } from './auth.interface';
import {
  createJsonWebToken,
  verifyJsonWebToken,
  verifyPassword,
} from '@/app/lib';
import prisma from '@/app/lib/prisma';

const authLogin = async (payload: TAuthLogin) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }
  const ok = await verifyPassword(payload.password, user.password);
  if (!ok) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid password');
  }
  const token = createJsonWebToken(
    { sub: user.id, email: user.email },
    String(config.JWT_SECRET),
  );

  return { token };
};

const authMe = async (token: string) => {
  const payload = verifyJsonWebToken<{ sub: number; email: string }>(
    token,
    String(config.JWT_SECRET),
  );
  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
  });
  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'Unauthorized');
  }
  const { password, ...safeUser } = user;
  return safeUser;
};

const AuthService = {
  authLogin,
  authMe,
};

export default AuthService;
