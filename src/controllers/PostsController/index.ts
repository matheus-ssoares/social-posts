import { NextFunction, Response } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { posts } from '../../database/models/posts';
import { users } from '../../database/models/users';
import { NotFoundError } from '../../helpers/error';
import { CreatePostRequestSchema } from './schemas';

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
