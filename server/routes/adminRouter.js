import express from 'express';
import {
  createPoliticalParty,
  createPoliticalOffice,
  deletePoliticalParty,
  registerPolitician
} from '../controllers/admin';
import authoriseUser from '../middlewares/authorization';

const adminRouter = express.Router();

adminRouter.post('/parties', authoriseUser, createPoliticalParty);
adminRouter.post('/offices', authoriseUser, createPoliticalOffice);
adminRouter.delete('/parties/:partyId', authoriseUser, deletePoliticalParty);
adminRouter.post(
  '/office/:officeId/register',
  authoriseUser,
  registerPolitician
);

export default adminRouter;
