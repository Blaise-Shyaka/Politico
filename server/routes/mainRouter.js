import express from 'express';
import usersRouter from './usersRouter';
import adminRouter from './adminRouter';

const router = express.Router();

router.use('/api', usersRouter);
router.use('/api', adminRouter);

export default router;
