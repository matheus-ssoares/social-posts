import express from 'express';
import { createPostRequestSchema } from '../controllers/PostsController/schemas';
import * as PostsController from '../controllers/PostsController';

import { validationBody } from '../helpers/validation';

export const postsRoutes = express.Router();

postsRoutes.post(
  '/',
  (req, res, next) => validationBody(createPostRequestSchema, req, res, next),
  PostsController.createPost,
);
