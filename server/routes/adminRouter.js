import express from 'express';
import createPoliticalParty from '../controllers/admin';

const adminRouter = express.Router();

adminRouter.post('/parties', createPoliticalParty);

export default adminRouter;
