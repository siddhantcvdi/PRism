// backend/controllers/repo.controller.js
import { getAuth } from "@clerk/express";
import axios from "axios";
import User from "../models/user.model.js";
import Repository from "../models/repository.model.js";
import PullRequest from '../models/pullRequest.model.js'; // Import PullRequest model
import { decrypt } from "../utils/crypto.js"; // Import your decryption utility

export const fetchAndProcessPullRequests = async (req, res) => {
  try {
    const { userId: clerkId } = getAuth(req);
    if (!clerkId) {
      return res.status(401).json({ error: "Clerk id not found." });
    }
    console.log("Clerk ID:", clerkId);
    
    const user = await User.findOne({ clerkId });
    if (!user || !user.githubAccessToken) {
      return res
        .status(400)
        .json({ error: "GitHub access token not found for this user." });
    }

    const { repoFullName } = req.body;
    if (!repoFullName) {
      return res.status(400).json({ error: "Repository full name is required." });
    }

    const repo_Name = repoFullName.split('/')[1];
    const repository = await Repository.findOne({ repoName: repo_Name });
    if (!repository) {
      return res.status(404).json({ error: "Repository not found." });
    }

    const githubToken = user.githubAccessToken;
    const decryptedToken = decrypt(githubToken); // Assuming you have a decrypt function to handle the token decryption
    
    const [owner, repoName] = repoFullName.split('/');
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repoName}/pulls?state=all&per_page=5&sort=created&direction=desc`; // Fetch latest 5 open PRs

    const response = await axios.get(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
        'Accept': 'application/vnd.github.v3+json',
      },
    });
    console.log("Response data",response.data);
    

    const fetchedPrs = response.data;
    const newPrsForRag = [];

    for (const fetchedPr of fetchedPrs) {
      const existingPr = await PullRequest.findOne({ githubId: fetchedPr.id });
    
      // Fetch commit messages for this PR
      const commitsUrl = `https://api.github.com/repos/${owner}/${repoName}/pulls/${fetchedPr.number}/commits`;
      const commitsResponse = await axios.get(commitsUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });
    
      const commitMessages = commitsResponse.data.map(commit => commit.commit.message);
    
      if (!existingPr) {
        const newPullRequest = new PullRequest({
          githubId: fetchedPr.id,
          title: fetchedPr.title,
          url: fetchedPr.html_url,
          state: fetchedPr.state,
          userId: user._id,
          repositoryId: repository._id,
          summary: fetchedPr.body || '', // full PR description
          commitMessages, // Save the array of commit messages
        });
        await newPullRequest.save();
        newPrsForRag.push(newPullRequest);
        console.log(`New PR fetched and saved for ${repoFullName}: ${newPullRequest.title}`);
      } else {
        console.log(`PR already exists for ${repoFullName}: ${fetchedPr.title}`);
      }
    }
    

    // TODO: Send 'newPrsForRag' to your RAG agent logic here
    if (newPrsForRag.length > 0) {
      console.log(`Sending ${newPrsForRag.length} new PRs to RAG agent.`);
      // You might want to emit a Socket.IO event here if needed
    }

    res.status(200).json({ message: `Fetched and processed pull requests for ${repoFullName}. ${newPrsForRag.length} new PRs for RAG.` });

  } catch (error) {
    console.error("Error fetching and processing pull requests:", error);
    if (error.response?.status === 401) {
      return res.status(401).json({ error: "Invalid GitHub access token." });
    } else if (error.response?.status === 404) {
      return res.status(404).json({ error: "Repository not found on GitHub." });
    }
    res.status(500).json({ error: "Failed to fetch and process pull requests." });
  }
};