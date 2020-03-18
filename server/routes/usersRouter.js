import express from 'express';
import {
  userSignUp,
  userSignIn,
  viewAllParties,
  viewAllOffices,
  viewSpecificParty
} from '../controllers/users';

import authoriseUser from '../middlewares/authorization';

const userRouter = express.Router();

userRouter.post('/auth/signup', userSignUp);
userRouter.post('/auth/signin', userSignIn);
userRouter.get('/parties/:partyId', authoriseUser, viewSpecificParty);
userRouter.get('/parties', authoriseUser, viewAllParties);
userRouter.get('/offices', authoriseUser, viewAllOffices);

export default userRouter;
