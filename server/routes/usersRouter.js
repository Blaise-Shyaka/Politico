import express from 'express';
import {
  userSignUp,
  userSignIn,
  viewAllParties,
  viewSpecificOffice,
  viewAllOffices,
  viewSpecificParty,
  castVote,
  getElectionResults
} from '../controllers/users';

import authoriseUser from '../middlewares/authorization';

const userRouter = express.Router();

userRouter.post('/auth/signup', userSignUp);
userRouter.post('/auth/signin', userSignIn);
userRouter.get('/parties/:partyId', authoriseUser, viewSpecificParty);
userRouter.get('/parties', authoriseUser, viewAllParties);
userRouter.get('/offices/:officeId', authoriseUser, viewSpecificOffice);
userRouter.get('/offices', authoriseUser, viewAllOffices);
userRouter.post('/votes', authoriseUser, castVote);
userRouter.get('/offices/:officeId/result', authoriseUser, getElectionResults);

export default userRouter;
