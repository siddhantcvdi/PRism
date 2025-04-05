import { getAuth } from "@clerk/express";
import User from "../models/user.model.js";
import axios from "axios";
import { encrypt,decrypt } from "../utils/crypto.js"; // Assuming you have an encrypt function
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

const githubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    console.log("Client code:", code);
    console.log("Client ID:", process.env.GITHUB_CLIENT_ID);

    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );
    console.log("Token Response:", tokenRes.data);

    const accessToken = tokenRes.data.access_token;
    console.log("Access Token:", accessToken);

    const userRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    const { id, login } = userRes.data;
    const clerkId = getAuth(req).userId;
    console.log(clerkId);

    if (!clerkId) {
      return res.status(401).json({ error: "Clerk id not found" });
    }

    const encryptedToken = encrypt(accessToken);
    console.log("encrypted token", encryptedToken);

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        clerkId,
        githubId: id,
        username: login,
        githubAccessToken: encryptedToken,
      },
      { upsert: true, new: true }
    );

    res.json({ message: "User authenticated and saved", encryptedToken, user });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
};
const loginUser = async (req, res) => {
  try {
    const clientId = process.env.GITHUB_CLIENT_ID;
    const redirectUri = process.env.GITHUB_CALLBACK_URL; // e.g., http://localhost:3000/callback
    const scope = "read:user repo";

    const githubAuthUrl =
      `https://github.com/login/oauth/authorize` +
      `?client_id=${clientId}` +
      `&redirect_uri=${redirectUri}` +
      `&scope=${scope}`;

    res.redirect(githubAuthUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Login failed" });
  }
};

export { githubCallback, loginUser, getUserReposData ,fetchRepositoryDataViaLink};
