import { Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { post_likes } from '../../database/models/post_likes';
import { users } from '../../database/models/users';
import { GenericError, NotFoundError } from '../../helpers/error';
import {
  CreatePostLikeRequestSchema,
  DeletePostLikeRequestSchema,
} from './schemas';

export const createPostLike = async (
  req: ValidatedRequest<CreatePostLikeRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { post_id, user_id, external_id } = req.body;

  try {
    const findUser = await users.findOne({
      where: user_id ? { id: user_id } : { external_id: external_id },
    });
    if (!findUser) {
      throw new NotFoundError();
    }
    const postLikeExists = await post_likes.findOne({
      where: { post_id, user_id: findUser.id },
    });

    if (postLikeExists) {
      throw new GenericError(409, 'this PostLike already exists');
    }
    const createdPostLike = await post_likes.create({
      post_id,
      user_id: findUser.id,
    });

    const findCreatedPostLike = await post_likes.findOne({
      where: { id: createdPostLike.id },
      include: [users],
    });
    res.json(findCreatedPostLike);
  } catch (error) {
    next(error);
  }
};

export const deletePostLike = async (
  req: ValidatedRequest<DeletePostLikeRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.query;
  try {
    const findPostLike = await post_likes.findOne({ where: { id } });
    if (!findPostLike) {
      throw new NotFoundError();
    }
    await post_likes.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
