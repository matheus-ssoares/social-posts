import { posts } from './models/posts';
import { post_comments } from './models/post_comments';
import { post_images } from './models/post_images';
import { post_likes } from './models/post_likes';
import { users } from './models/users';

export const models = [users, posts, post_images, post_likes, post_comments];
