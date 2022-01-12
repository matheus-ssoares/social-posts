import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
  HasMany,
} from 'sequelize-typescript';
import { posts } from './posts';

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

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
