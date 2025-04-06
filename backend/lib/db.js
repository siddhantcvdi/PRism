import mongoose from "mongoose";

export const connectDB = async (req, res) => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected:");
  } catch (error) {
    console.log("MONGO DB connection error", error.message);
  }
};
