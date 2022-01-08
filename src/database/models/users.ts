import {
  Model,
  PrimaryKey,
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
} from 'sequelize-typescript';

@Table
export class users extends Model<users> {
  @PrimaryKey
  @Column
  id: string;

  @Column
  name: string;

  @Column
  image: string;

  @Column
  externalId: string;

  @CreatedAt
  created_at: Date;

  @UpdatedAt
  updated_at: Date;
}
