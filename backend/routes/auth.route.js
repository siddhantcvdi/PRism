import express from 'express'
import { githubCallback ,loginUser, checkGithubAuth } from '../controllers/auth.controller.js';
import { requireAuth } from '@clerk/express';

const authRouter=express.Router();

authRouter.get("/login",requireAuth(),loginUser);
authRouter.get("/github/callback",githubCallback);
authRouter.get("/check-token", checkGithubAuth);

export { authRouter };