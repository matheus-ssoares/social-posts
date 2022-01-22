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

@Table
export class post_images extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: string;

  @Column
  image: string;

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
