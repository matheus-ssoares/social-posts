import { Response, NextFunction } from 'express';
import { ValidatedRequest } from 'express-joi-validation';
import { ForeignKeyConstraintError } from 'sequelize';
import { post_comments } from '../../database/models/post_comments';
import { users } from '../../database/models/users';
import { NotFoundError } from '../../helpers/error';
import {
  CreatePostCommentRequestSchema,
  DeletePostCommentRequestSchema,
  GetAllPostCommentsRequestSchema,
} from './schemas';

export const getAllPostComments = async (
  req: ValidatedRequest<GetAllPostCommentsRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { id, skip } = req.query;
  try {
    const { rows, count } = await post_comments.findAndCountAll({
      where: { post_id: id },
      limit: 30,
      order: [['createdAt', 'DESC']],
      offset: Number(skip),
      include: [users],
    });

    res.json({ total: count, postComments: rows });
  } catch (error) {
    next(error);
  }
};

export const createPostComment = async (
  req: ValidatedRequest<CreatePostCommentRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { comment, post_id, user_id, external_id } = req.body;
  try {
    const findUser = await users.findOne({
      where: user_id ? { id: user_id } : { external_id },
    });
    if (!findUser) throw new NotFoundError('User not found');

    const createdPostComment = await post_comments.create({
      comment,
      post_id,
      user_id: findUser.id,
    });
    res.json((await createdPostComment.reload({ include: [users] })).toJSON());
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
