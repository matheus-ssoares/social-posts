import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface CreatePostRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    content: string;
    user_id?: string;
    external_id?: string;
  };
}

export const createPostRequestSchema = Joi.object({
  content: Joi.string().required(),
  user_id: Joi.string().when('external_id', {
    is: Joi.exist(),
    then: Joi.string(),
    otherwise: Joi.string().required(),
  }),
  external_id: Joi.string(),
});

export interface UpdatePostRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    content?: string;
  };
}

export const updatePostSchema = Joi.object({
  content: Joi.string(),
});
