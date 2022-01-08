import express from 'express';
import { createValidator } from 'express-joi-validation';
import * as UsersController from '../controllers/UsersController';
import { createUserSchema } from '../controllers/UsersController/schemas';
import { validationBody } from '../helpers/validation';

export const userRoutes = express.Router();

userRoutes.post(
  '/',
  (req, res, next) => validationBody(createUserSchema, req, res, next),
  UsersController.createUser,
);
