import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface CreateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name: string;
    image: string;
    external_id: string;
  };
}

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  external_id: Joi.string().uuid().required(),
});

export interface UpdateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Body]: {
    name?: string;
    image?: string;
    external_id?: string;
  };
}

export const updateUserSchema = Joi.object({
  name: Joi.string(),
  image: Joi.string(),
  external_id: Joi.string().uuid(),
});
