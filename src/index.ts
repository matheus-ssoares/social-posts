/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import './database/connection';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { userRoutes } from './routes/userRoutes';
import { handleError } from './helpers/error';
import { postsRoutes } from './routes/postsRoutes';
import { rabbitMqConnect } from './utils/rabbitMqConnect';
import { RabbitMqQueues } from './interfaces/rabbitMqQueues';
import { homedir } from 'os';
import { postLikesRoutes } from './routes/postLikesRoutes';
import { postCommentsRoutes } from './routes/postCommentsRoutes';

dotenv.config();

const PORT = process.env.PORT || 6001;

const app = express();
app.use(
  cors({
    origin: [
      /* 'https://social-media-sandy.vercel.app', */
      'http://localhost:3000',
    ],
  }),
);
app.use(express.json({ limit: '10000mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/users', userRoutes);
app.use('/posts', postsRoutes);
app.use('/post-likes', postLikesRoutes);
app.use('/post-comments', postCommentsRoutes);

const expressServer = http.createServer(app);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});
app.use('/static', express.static(homedir + '/social-posts'));

rabbitMqConnect(RabbitMqQueues.SOCIAL_USERS);
expressServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
