import express from 'express'
import { githubCallback ,loginUser} from '../controllers/auth.controller.js';
import { requireAuth,getAuth,clerkClient } from '@clerk/express';

const authRouter=express.Router();

authRouter.get("/login",requireAuth(),loginUser);
authRouter.get("/github/callback",githubCallback);

export { authRouter };