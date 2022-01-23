import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface CreatePostCommentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    comment: string;
    post_id: string;
    user_id: string;
  };
}

export const createPostCommentRequestSchema = Joi.object({
  comment: Joi.string().max(240),
  post_id: Joi.string().uuid().required(),
  user_id: Joi.string().uuid().required(),
});
export interface DeletePostCommentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const deletePostCommentRequestSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
