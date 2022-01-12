import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { users } from '../../database/models/users';
import { GenericError, NotFoundError } from '../../helpers/error';

import { CreateUserRequestSchema, UpdateUserRequestSchema } from './schemas';

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
export const updateUser = async (
  req: ValidatedRequest<UpdateUserRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params?.id;

  try {
    if (!id) {
      throw new GenericError(400, 'id is required');
    }

    const foundUser = await users.findOne({ where: { id } });

    if (!foundUser) {
      throw new NotFoundError();
    }
    const body = req.body;
    await users.update(
      {
        ...body,
        updated_at: new Date(),
      },
      { where: { id } },
    );
    const updatedUser = await users.findOne({ where: { id } });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
