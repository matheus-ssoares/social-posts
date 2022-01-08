import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';
import Joi from 'joi';

export interface CreateUserRequestSchema extends ValidatedRequestSchema {
  [ContainerTypes.Query]: {
    name: string;
  };
}

export const createUserSchema = Joi.object({
  name: Joi.string().required(),
  image: Joi.string(),
  external_id: Joi.string().uuid().required(),
});
