import { NextFunction, Request, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { posts } from '../../database/models/posts';
import { users } from '../../database/models/users';
import { GenericError, NotFoundError } from '../../helpers/error';
import { CreatePostRequestSchema, UpdatePostRequestSchema } from './schemas';

export const createPost = async (
  req: ValidatedRequest<CreatePostRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  try {
    const findUser = await users.findOne({
      where: { id: body.user_id },
    });

    if (!findUser) {
      throw new NotFoundError();
    }

    const post = await posts.create({
      content: body.content,
      user_id: findUser.id,
      created_at: new Date(),
      updated_at: new Date(),
    });
    res.status(200).json(post);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const updatePost = async (
  req: ValidatedRequest<UpdatePostRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params?.id;

  try {
    if (!id) {
      throw new GenericError(400, 'id is required');
    }

    const foundPost = await posts.findOne({ where: { id } });

    if (!foundPost) {
      throw new NotFoundError();
    }
    const body = req.body;
    await posts.update(
      {
        ...body,
        updated_at: new Date(),
      },
      { where: { id } },
    );
    const updatedUser = await posts.findOne({ where: { id } });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
