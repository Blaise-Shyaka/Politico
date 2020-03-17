import express from 'express';
import { userSignUp, userSignIn, viewAllParties } from '../controllers/users';
import authoriseUser from '../middlewares/authorization';

const userRouter = express.Router();

userRouter.post('/auth/signup', userSignUp);
userRouter.post('/auth/signin', userSignIn);
userRouter.get('/parties', authoriseUser, viewAllParties);

export default userRouter;
