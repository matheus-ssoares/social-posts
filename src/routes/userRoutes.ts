import express from 'express';
import * as UsersController from '../controllers/UsersController';
import {
  createUserSchema,
  updateUserSchema,
} from '../controllers/UsersController/schemas';
import { validationBody } from '../helpers/validation';

export const userRoutes = express.Router();

userRoutes.post(
  '/',
  (req, res, next) => validationBody(createUserSchema, req, res, next),
  UsersController.createUser,
);

userRoutes.put(
  '/:id',
  (req, res, next) => validationBody(updateUserSchema, req, res, next),
  UsersController.updateUser,
);
