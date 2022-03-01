import { NextFunction, Response } from 'express';
import fs from 'fs';
import { homedir } from 'os';
import { ValidatedRequest } from 'express-joi-validation';
import { sequelize } from '../../database/connection';
import { posts } from '../../database/models/posts';
import { post_images } from '../../database/models/post_images';
import { users } from '../../database/models/users';
import { GenericError, NotFoundError } from '../../helpers/error';
import {
  CreatePostRequestSchema,
  GetAllPostsByUserRequestSchema,
  GetAllPostsRequestSchema,
  UpdatePostRequestSchema,
} from './schemas';
import { post_comments } from '../../database/models/post_comments';
import { post_likes } from '../../database/models/post_likes';

export const getAllPosts = async (
  req: ValidatedRequest<GetAllPostsRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  const { skip } = req.query;

  try {
    if (!skip) {
      throw new GenericError(400, 'skip is required');
    }
    const postsAmount = await posts.count();
    const findPosts = await posts.findAll({
      limit: 30,
      offset: Number(skip),
      order: [['createdAt', 'DESC']],
      include: [
        users,
        { model: post_comments, include: [users], limit: 4 },
        { model: post_likes, include: [users] },
        post_images,
      ],
    });

    return res.json({
      total: postsAmount,
      posts: findPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllPostsByUser = async (
  req: ValidatedRequest<GetAllPostsByUserRequestSchema>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, external_id, skip } = req.query;

    const findUser = await users.findOne({
      where: user_id ? { id: user_id } : { external_id: external_id },
    });

    if (!findUser) {
      throw new NotFoundError('User not found');
    }
    const countPosts = await posts.count();

    const findPosts = await posts.findAll({
      where: { user_id: findUser.id },
      limit: 30,
      offset: Number(skip),
      order: [['createdAt', 'DESC']],
      include: [
        users,
        { model: post_comments, include: [users], limit: 4 },
        { model: post_likes, include: [users] },
        post_images,
      ],
    });

    res.json({ total: countPosts, posts: findPosts });
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
      where: body?.user_id
        ? { id: body?.user_id }
        : { external_id: body?.external_id },
    });

    if (!findUser) {
      throw new NotFoundError();
    }

    const post = await posts.create(
      {
        content: body.content,
        user_id: findUser.id,
        created_at: new Date(),
        updated_at: new Date(),
      },
      { transaction },
    );

    const requestImages = req.files as Express.Multer.File[];

    if (requestImages) {
      requestImages.forEach(async image => {
        await post_images.create({
          image: image.filename,
          post_id: post.id,
        });
      });
    }
    await transaction.commit();

    setTimeout(async () => {
      res
        .status(200)
        .json(
          (
            await post.reload({ include: [post_likes, users, post_images] })
          ).toJSON(),
        );
    }, 500);
  } catch (error) {
    await transaction.rollback();
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

    await post_images.destroy({
      where: { post_id: id },
      transaction: transaction,
    });
    await posts.destroy({ where: { id }, transaction: transaction });

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
