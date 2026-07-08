import { Request, Response, NextFunction, RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';

const validateRequest =
  (schema: ZodTypeAny): RequestHandler =>
  (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body);
    if (!parsed.success) {
      return next(parsed.error);
    }
    req.body = parsed.data;
    next();
  };

export default validateRequest;
