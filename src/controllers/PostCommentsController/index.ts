import { Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { ForeignKeyConstraintError } from 'sequelize';
import { post_comments } from '../../database/models/post_comments';
import { NotFoundError } from '../../helpers/error';
import {
  CreatePostCommentRequestSchema,
  DeletePostCommentRequestSchema,
} from './schemas';

export const createPostComment = async (
  req: ValidatedRequest<CreatePostCommentRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { comment, post_id, user_id } = req.body;
  try {
    const createdPostComment = await post_comments.create({
      comment,
      post_id,
      user_id,
    });
    res.json(createdPostComment);
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      res.status(404).json({
        status: 'error',
        statusCode: 404,
        message: 'Not found',
      });
      return;
    }
    next(error);
  }
};

export const deletePostComment = async (
  req: ValidatedRequest<DeletePostCommentRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { id } = req.params;
  try {
    const findPostComment = await post_comments.findOne({ where: { id } });
    if (!findPostComment) {
      throw new NotFoundError();
    }
    await post_comments.destroy({ where: { id } });
    res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};
