import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { users } from '../../database/models/users';

import { CreateUserRequestSchema } from './schemas';

export const createUser = async (
  req: ValidatedRequest<CreateUserRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  try {
    const user = await users.create({
      image: body.image,
      external_id: body.external_id,
      name: body.name,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
