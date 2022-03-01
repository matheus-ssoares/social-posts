import express from 'express';

import * as PostCommentsController from '../controllers/PostCommentsController';
import {
  createPostCommentRequestSchema,
  deletePostCommentRequestSchema,
  getAllPostCommentsRequestSchema,
} from '../controllers/PostCommentsController/schemas';
import { SchemaTypes, validation } from '../helpers/validation';

export const postCommentsRoutes = express.Router();

postCommentsRoutes.get(
  '/',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.QUERY, schema: getAllPostCommentsRequestSchema }],
      req,
      res,
      next,
    ),
  PostCommentsController.getAllPostComments,
);

postCommentsRoutes.post(
  '/',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: createPostCommentRequestSchema }],
      req,
      res,
      next,
    ),
  PostCommentsController.createPostComment,
);

postCommentsRoutes.delete(
  '/:id',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.HEADER, schema: deletePostCommentRequestSchema }],
      req,
      res,
      next,
    ),
  PostCommentsController.deletePostComment,
);
