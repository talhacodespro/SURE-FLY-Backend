import jwt from 'jsonwebtoken';

export const createJsonWebToken = (
  payload: Record<string, unknown>,
  secret: string,
  expiresInSec = 7 * 24 * 60 * 60
) => {
  return jwt.sign(payload, secret, {
    algorithm: 'HS256',
    expiresIn: expiresInSec,
  });
};

export const verifyJsonWebToken = <T = Record<string, unknown>>(
  token: string,
  secret: string
): T => {
  return jwt.verify(token, secret, { algorithms: ['HS256'] }) as T;
};
