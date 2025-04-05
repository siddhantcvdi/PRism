import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true,
    unique: true,
  },
  githubAccessToken: {
    type: String,
  },
  githubId: {
    type: Number,
    unique: true,
  },
  username: {
    type: String,
  },
});

const User = mongoose.model("User", userSchema);

export default User;