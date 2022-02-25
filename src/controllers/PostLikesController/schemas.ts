import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface CreatePostLikeRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    post_id: string;
    user_id?: string;
    external_id?: string;
  };
}

export const createPostLikeRequestSchema = Joi.object({
  post_id: Joi.string().uuid().required(),
  user_id: Joi.string().when('external_id', {
    is: Joi.exist(),
    then: Joi.string(),
    otherwise: Joi.string().required(),
  }),
  external_id: Joi.string(),
});

export interface DeletePostLikeRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Params]: {
    id: string;
  };
}

export const deletePostLikeRequestSchema = Joi.object({
  id: Joi.string().uuid().required(),
});
