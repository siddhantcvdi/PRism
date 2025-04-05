import mongoose from "mongoose";

const userRepoSchema = new mongoose.Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  repository: {
    type: Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
});

// Ensure that each user-repo pair is unique
userRepoSchema.index({ user: 1, repository: 1 }, { unique: true });

const UserRepo = mongoose.model('UserRepo', userRepoSchema);

export default UserRepo;