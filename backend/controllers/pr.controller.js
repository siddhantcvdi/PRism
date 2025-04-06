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
    if (!clerkId) return res.status(401).json({ error: "Clerk id not found." });

    const user = await User.findOne({ clerkId });
    if (!user || !user.githubAccessToken) {
      return res.status(400).json({ error: "GitHub access token not found for this user." });
    }

    const { repoFullName } = req.body;
    if (!repoFullName) return res.status(400).json({ error: "Repository full name is required." });

    const [owner, repoName] = repoFullName.split('/');
    const repository = await Repository.findOne({ repoName });
    if (!repository) return res.status(404).json({ error: "Repository not found." });

    const decryptedToken = decrypt(user.githubAccessToken);
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repoName}/pulls?state=closed&per_page=2&sort=created&direction=desc`;

    const response = await axios.get(githubApiUrl, {
      headers: {
        Authorization: `Bearer ${decryptedToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const fetchedPrs = response.data;
    const newPrsForRag = [];

    for (const fetchedPr of fetchedPrs) {
      const existingPr = await PullRequest.findOne({ githubId: fetchedPr.id });

      // Get commit messages
      const commitsUrl = `https://api.github.com/repos/${owner}/${repoName}/pulls/${fetchedPr.number}/commits`;
      const commitsResponse = await axios.get(commitsUrl, {
        headers: {
          Authorization: `Bearer ${decryptedToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });
      const commitMessages = commitsResponse.data.map(commit => commit.commit.message);

      // Get raw diff
      let diffContent = '';
      try {
        const diffResponse = await axios.get(fetchedPr.diff_url, {
          headers: {
            Authorization: `Bearer ${decryptedToken}`,
            Accept: 'application/vnd.github.v3.diff',
          },
        });
        diffContent = diffResponse.data;
      } catch (diffErr) {
        console.error(`Failed to fetch diff for PR #${fetchedPr.number}:`, diffErr.message);
      }

      // Send to RAG for summarization
      let diffSummary = '';
      try {
        const ragResponse = await axios.post("http://localhost:8000/summarize", {
          diff_content: diffContent,
        });
        diffSummary = ragResponse.data.summary;
        console.log(`RAG summary generated for PR #${fetchedPr.number}`);
      } catch (ragErr) {
        console.error(`RAG summarization failed for PR #${fetchedPr.number}:`, ragErr.message);
      }

      if (!existingPr) {
        const newPullRequest = new PullRequest({
          githubId: fetchedPr.id,
          title: fetchedPr.title,
          url: fetchedPr.html_url,
          state: fetchedPr.state,
          userId: user._id,
          repositoryId: repository._id,
          summary: fetchedPr.body || '',
          commitMessages,
          diff: diffContent,
          diffSummary,
        });
        await newPullRequest.save();
        newPrsForRag.push(newPullRequest);
        console.log(`New PR saved for ${repoFullName}: ${newPullRequest.title}`);
      } else {
        existingPr.diff = diffContent;
        existingPr.commitMessages = commitMessages;
        existingPr.diffSummary = diffSummary;
        await existingPr.save();
        console.log(`Existing PR updated with new diff and summary: ${fetchedPr.title}`);
      }
    }

    const allPrs = await PullRequest.find({ repositoryId: repository._id }).sort({ createdAt: -1 });

    res.status(200).json({
      message: `Fetched, saved, and retrieved ${allPrs.length} PRs for repository: ${repoFullName}`,
      prs: allPrs,
    });

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
