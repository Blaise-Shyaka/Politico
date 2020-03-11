import express from 'express';
import usersRouter from './usersRouter';

const router = express.Router();

router.use('/api', usersRouter);

export default router;
