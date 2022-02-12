import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { homedir } from 'os';
import { ValidatedRequest } from 'express-joi-validation';
import { sequelize } from '../../database/connection';
import { posts } from '../../database/models/posts';
import { post_images } from '../../database/models/post_images';
import { users } from '../../database/models/users';
import { GenericError, NotFoundError } from '../../helpers/error';
import { CreatePostRequestSchema, UpdatePostRequestSchema } from './schemas';

export const getAllPosts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rows, count } = await posts.findAndCountAll({ limit: 30 });

    return res.json({
      total: count,
      posts: rows,
    });
  } catch (error) {
    next(error);
  }
};

export const createPost = async (
  req: ValidatedRequest<CreatePostRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const body = req.body;

  const transaction = await sequelize.transaction();
  try {
    const findUser = await users.findOne({
      where: { id: body.user_id },
    });

    if (!findUser) {
      throw new NotFoundError();
    }

    const post = await posts.create({
      content: body.content,
      user_id: findUser.id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const requestImages = req.files as Express.Multer.File[];

    if (requestImages) {
      requestImages.forEach(async image => {
        post_images.create({
          image: image.filename,
          post_id: post.id,
        });
      });
    }

    transaction.commit();
    res.status(200).json(post);
  } catch (error) {
    transaction.rollback();
    console.log(error);
    next(error);
  }
};

export const updatePost = async (
  req: ValidatedRequest<UpdatePostRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params?.id;

  try {
    if (!id) {
      throw new GenericError(400, 'id is required');
    }

    const foundPost = await posts.findOne({ where: { id } });

    if (!foundPost) {
      throw new NotFoundError();
    }
    const body = req.body;
    await posts.update(
      {
        ...body,
        updated_at: new Date(),
      },
      { where: { id } },
    );
    const updatedUser = await posts.findOne({ where: { id } });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
export const deletePost = async (
  req: ValidatedRequest<UpdatePostRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const id = req.params?.id;
  const transaction = await sequelize.transaction();
  try {
    if (!id) {
      throw new GenericError(400, 'id is required');
    }

    const foundPost = await posts.findOne({ where: { id } });

    if (!foundPost) {
      throw new NotFoundError();
    }

    const findAllPostFiles = await post_images.findAll({
      where: { post_id: foundPost.id },
    });

    await post_images.destroy({ where: { post_id: id } });
    await posts.destroy({ where: { id } });

    findAllPostFiles.forEach(file => {
      try {
        fs.unlink(`${homedir}/social-posts/post-images/${file.image}`, err => {
          if (err) {
            console.log(
              500,
              `failed to delete file, id: ${file.id} name: ${file.image} path: ${homedir}/social-posts/post-images/${file.image}`,
            );
          }
          console.log(
            `deleted file id: ${file.id} name: ${file.image} path: ${homedir}/social-posts/post-images/${file.image}`,
          );
        });
      } catch (error) {
        next(error);
      }
    });

    transaction.commit();
    res.sendStatus(200);
  } catch (error) {
    transaction.rollback();
    next(error);
  }
};
