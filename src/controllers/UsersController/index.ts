import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';

import { CreateUserRequestSchema } from './schemas';

export const createUser = async (
  req: ValidatedRequest<CreateUserRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    // throw new ErrorHandler(400, 'Missing required email and password fields');
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
