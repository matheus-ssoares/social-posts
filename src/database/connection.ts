import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

const conn = new Sequelize({
  dialect: 'postgres',
  port: Number(process.env.DB_PORT) || 5432,
  host: process.env.NODE_ENV == 'development' ? 'localhost' : '',
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  logging: true,
});

conn
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(error => {
    console.error('Unable to connect to the database:', error);
  });
