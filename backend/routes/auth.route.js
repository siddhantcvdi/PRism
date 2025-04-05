import express from 'express'
import { githubCallback ,loginUser,fetchRepositoryDataViaLink} from '../controllers/auth.controller.js';
import { requireAuth,getAuth,clerkClient } from '@clerk/express';

const authRouter=express.Router();

authRouter.get("/login",requireAuth(),loginUser);
authRouter.get("/github/callback",githubCallback);
console.log("inside auth  router");

authRouter.get("/repo-info",fetchRepositoryDataViaLink);
authRouter.get("/simran", (req, res) => {
    console.log("inside github route");
    return res.json({ message: "Hello from github route" });
    

});
export { authRouter };