import express from 'express';
import {
  createPoliticalParty,
  deletePoliticalParty
} from '../controllers/admin';
import authoriseUser from '../middlewares/authorization';

const adminRouter = express.Router();

adminRouter.post('/parties', authoriseUser, createPoliticalParty);
adminRouter.delete('/parties/:partyId', authoriseUser, deletePoliticalParty);

export default adminRouter;
