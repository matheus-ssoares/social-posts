import express from 'express';
import * as UsersController from '../controllers/UsersController';
import {
  createUserSchema,
  updateUserSchema,
} from '../controllers/UsersController/schemas';
import { SchemaTypes, validation } from '../helpers/validation';

export const userRoutes = express.Router();

userRoutes.post(
  '/',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: createUserSchema }],
      req,
      res,
      next,
    ),
  UsersController.createUser,
);

userRoutes.put(
  '/:id',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: updateUserSchema }],
      req,
      res,
      next,
    ),
  UsersController.updateUser,
);
