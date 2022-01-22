import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { posts } from './posts';
import { users } from './users';

@Table
export class post_likes extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  @ForeignKey(() => users)
  user_id: string;

  @Column
  @ForeignKey(() => posts)
  post_id: string;

  @BelongsTo(() => posts)
  posts: posts;

  @BelongsTo(() => users)
  users: users;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
