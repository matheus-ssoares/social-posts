import {
  Model,
  PrimaryKey,
  Table,
  Column,
  AutoIncrement,
} from 'sequelize-typescript';

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

  @Column
  createdAt: Date;

  @Column
  updatedAt: Date;
}
