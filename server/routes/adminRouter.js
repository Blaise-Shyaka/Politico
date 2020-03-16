import express from 'express';
import createPoliticalParty from '../controllers/admin';
import authoriseUser from '../middlewares/authorization';

const adminRouter = express.Router();

adminRouter.post('/parties', authoriseUser, createPoliticalParty);

export default adminRouter;
