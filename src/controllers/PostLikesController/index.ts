import { Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { post_likes } from '../../database/models/post_likes';
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
  const { post_id, user_id } = req.body;

  try {
    const postLikeExists = await post_likes.findOne({
      where: { post_id, user_id },
    });

    if (postLikeExists) {
      throw new GenericError(409, 'this PostLike already exists');
    }

    const createdPostLike = await post_likes.create({ post_id, user_id });
    res.json(createdPostLike);
  } catch (error) {
    next(error);
  }
};

export const deletePostLike = async (
  req: ValidatedRequest<DeletePostLikeRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
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
