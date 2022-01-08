import express from 'express';
import * as UsersController from '../controllers/UsersController';

export const userRoutes = express.Router();

userRoutes.post('/', UsersController.createUser);
