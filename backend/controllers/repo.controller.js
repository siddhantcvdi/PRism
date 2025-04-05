import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import axios from "axios";
import { decrypt } from "../utils/crypto.js";

const fetchRepositoryDataViaLink=async(req,res)=>{
    try {
        console.log("inside fetch repository data via link");  
        const { repositoryLink } = req.body; 
        
        const { userId: clerkId } = getAuth(req);
        if (!clerkId) {
        return res.status(401).json({ error: "Clerk id not found." });
        }
    
        const user = await User.findOne({ clerkId });
        if (!user) {
        return res.status(404).json({ error: "User not found." });
        }
        console.log("user", user);
    
        
        console.log("repository link", repositoryLink);
        
        if (!repositoryLink) {
        return res.status(400).json({ error: "Repository link is required." });
        }
    
        const repoName = repositoryLink.split("/").slice(-2).join("/");
        console.log("repo name", repoName);

        const encryptedToken = decrypt(user.githubAccessToken);
        console.log("decrypted token", encryptedToken);
    
        const response = await axios.get(`https://api.github.com/repos/${repoName}`, {
        headers: {
            Authorization: `token ${encryptedToken}`,
            Accept: "application/vnd.github.v3+json",
        },
        });
    
        console.log("response", response.data);
        res.status(200).json(response.data);
    } catch (error) {
        console.error("Error fetching repository data:", error);
        res.status(500).json({ error: "Failed to fetch repository data." });
    }


}
const getUserReposData = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: "Clerk id not found." });
    }

    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const watchedRepositories = await UserRepo.find({ user: user._id })
      .populate("repository")
      .then((links) => links.map((link) => link.repository));

    res.status(200).json(watchedRepositories);
  } catch (error) {
    console.error("Error fetching user's linked repository data:", error);
    res.status(500).json({ error: "Failed to fetch linked repository data." });
  }
};

export { getUserReposData ,fetchRepositoryDataViaLink };