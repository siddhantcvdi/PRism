import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema({
  gihubId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const Repository = mongoose.model("Repository", repositorySchema);

export default Repository;
