import express from 'express';
import http from 'http';
import './database/connection';

import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 6001;

const app = express();

const expressServer = http.createServer(app);

expressServer.listen(PORT, () => console.log(`Listening on port ${PORT}`));
