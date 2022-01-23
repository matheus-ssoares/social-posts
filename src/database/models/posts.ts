import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  HasMany,
} from 'sequelize-typescript';
import { post_comments } from './post_comments';
import { post_images } from './post_images';
import { post_likes } from './post_likes';
import { users } from './users';

@Table
export class posts extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  content: string;

  @Column
  @ForeignKey(() => users)
  user_id: string;

  @BelongsTo(() => users)
  users: users;

  @HasMany(() => post_images)
  post_images: post_images;

  @HasMany(() => post_likes)
  post_likes: post_likes[];

  @HasMany(() => post_comments)
  post_comments: post_comments[];

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
