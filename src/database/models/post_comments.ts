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
export class post_comments extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  comment: string;

  @Column
  @ForeignKey(() => users)
  user_id: string;

  @BelongsTo(() => users)
  users: users;

  @Column
  @ForeignKey(() => posts)
  post_id: string;

  @BelongsTo(() => posts)
  posts: posts;

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
