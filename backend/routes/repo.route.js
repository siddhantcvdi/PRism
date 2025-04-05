import express from 'express'
import { fetchRepositoryDataViaLink} from '../controllers/repo.controller.js';
import { requireAuth } from '@clerk/express';

const repoRouter = express.Router();

repoRouter.get("/repo-info", requireAuth(), fetchRepositoryDataViaLink);

export { repoRouter };