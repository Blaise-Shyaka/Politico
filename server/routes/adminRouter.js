import express from 'express';
import {
  createPoliticalParty,
  createPoliticalOffice
} from '../controllers/admin';
import authoriseUser from '../middlewares/authorization';

const adminRouter = express.Router();

adminRouter.post('/parties', authoriseUser, createPoliticalParty);
adminRouter.post('/offices', authoriseUser, createPoliticalOffice);

export default adminRouter;
