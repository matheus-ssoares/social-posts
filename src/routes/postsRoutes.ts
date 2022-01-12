import express from 'express';
import {
  createPostRequestSchema,
  updatePostSchema,
} from '../controllers/PostsController/schemas';
import * as PostsController from '../controllers/PostsController';

import { validationBody } from '../helpers/validation';

export const postsRoutes = express.Router();

postsRoutes.post(
  '/',
  (req, res, next) => validationBody(createPostRequestSchema, req, res, next),
  PostsController.createPost,
);
postsRoutes.put(
  '/:id',
  (req, res, next) => validationBody(updatePostSchema, req, res, next),
  PostsController.updatePost,
);
