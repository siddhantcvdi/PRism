import express from "express";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 3000;
app.get("/", (req, res) => {
  res.send("Hello from backend!");
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
