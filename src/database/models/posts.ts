import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
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

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
