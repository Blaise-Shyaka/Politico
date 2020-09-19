/* eslint-disable no-console */
import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import router from './routes/mainRouter';

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(router);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`We're listening on port ${port}`);
});

export default app;
