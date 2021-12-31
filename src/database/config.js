// eslint-disable-next-line @typescript-eslint/no-var-requires
var path = require('path');
import dotenv from 'dotenv';
dotenv.config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.NODE_ENV == 'development' ? 'localhost' : '',
    dialect: 'postgres',
    'migrations-path': path.resolve(__dirname, 'src', 'migrations'),
  },
  // test: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_test',
  //   host: '127.0.0.1',
  //   dialect: 'mysql',
  // },
  // production: {
  //   username: 'root',
  //   password: null,
  //   database: 'database_production',
  //   host: '127.0.0.1',
  //   dialect: 'mysql',
  // },
};
