import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface GetAllPostCommentsRequestSchema
  extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    id: string;
    skip: string;
  };
}

export const getAllPostCommentsRequestSchema = Joi.object({
  id: Joi.string().uuid().required(),
  skip: Joi.string().required(),
});

export interface CreatePostCommentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    comment: string;
    post_id: string;
    user_id: string;
    external_id?: string;
  };
}

export const createPostCommentRequestSchema = Joi.object({
  comment: Joi.string().max(240),
  post_id: Joi.string().uuid().required(),
  user_id: Joi.string().when('external_id', {
    is: Joi.exist(),
    then: Joi.string(),
    otherwise: Joi.string().required(),
  }),
  external_id: Joi.string(),
});
export interface DeletePostCommentRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const deletePostCommentRequestSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
