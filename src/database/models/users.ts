import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { posts } from './posts';
import { post_likes } from './post_likes';

@Table
export class users extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  name: string;

  @Column
  image: string;

  @Column
  external_id: string;

  @HasMany(() => posts)
  posts: posts[];

  @HasMany(() => post_likes)
  post_likes: post_likes[];

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
