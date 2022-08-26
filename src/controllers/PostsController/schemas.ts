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

export interface GetAllPostsRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    skip: string;
  };
}

export const getAllPostsSchema = Joi.object({
  skip: Joi.required(),
});

export interface UpdatePostRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    content?: string;
  };
}

export const updatePostSchema = Joi.object({
  content: Joi.string(),
});

export interface GetAllPostsByUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    skip: string;
    user_id: string;
    external_id?: string;
  };
}

export const getAllPostsByUserSchema = Joi.object({
  skip: Joi.string().required(),
  user_id: Joi.string().when('external_id', {
    is: Joi.exist(),
    then: Joi.string(),
    otherwise: Joi.string().required(),
  }),
  external_id: Joi.string(),
});

export interface GetPostRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    post_id: string;
  };
}

export const getPostSchema = Joi.object({
  post_id: Joi.string().uuid().required(),
});
