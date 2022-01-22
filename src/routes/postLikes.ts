import express from 'express';
import {
  createPostLikeRequestSchema,
  deletePostLikeRequestSchema,
} from '../controllers/PostLikesController/schemas';
import * as PostLikesController from '../controllers/PostLikesController';

import { SchemaTypes, validation } from '../helpers/validation';

export const postLikesRoutes = express.Router();

postLikesRoutes.post(
  '/',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: createPostLikeRequestSchema }],
      req,
      res,
      next,
    ),
  PostLikesController.createPostLike,
);

postLikesRoutes.delete(
  '/:id',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.HEADER, schema: deletePostLikeRequestSchema }],
      req,
      res,
      next,
    ),
  PostLikesController.deletePostLike,
);
