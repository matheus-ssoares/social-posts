import express from 'express';
import multer from 'multer';
import {
  createPostRequestSchema,
  updatePostSchema,
} from '../controllers/PostsController/schemas';
import * as PostsController from '../controllers/PostsController';
import { SchemaTypes, validation } from '../helpers/validation';
import { homedir } from 'os';

const upload = multer({
  storage: multer.diskStorage({
    destination: `${homedir}/social-posts/post-images`,
    filename: (request, file, cb) => {
      const filename = `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`;

      cb(null, filename);
    },
  }),
});

export const postsRoutes = express.Router();

postsRoutes.get('/', PostsController.getAllPosts);

postsRoutes.post(
  '/',
  upload.array('images'),
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: createPostRequestSchema }],
      req,
      res,
      next,
    ),
  PostsController.createPost,
);
postsRoutes.put(
  '/:id',
  (req, res, next) =>
    validation(
      [{ type: SchemaTypes.BODY, schema: updatePostSchema }],
      req,
      res,
      next,
    ),
  PostsController.updatePost,
);
postsRoutes.delete('/:id', PostsController.deletePost);
