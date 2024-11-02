import express from "express";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import meetingRoutes from "./routes/meetings.js";
import cors from 'cors';
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load environment variables

const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN })); // Use the CORS origin from the .env file
app.use("/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/meetings", meetingRoutes);

const PORT = process.env.PORT || 8800; // Default to 8800 if not specified in .env
app.listen(PORT, (err) => {
  if (err) {
    console.error("Server failed to start:", err);
  } else {
    console.log("Connected on port:", PORT);
  }
});
