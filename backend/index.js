require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db/db");
const { connectCloudinary } = require("./config/cloudinary");

const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const port = process.env.PORT || 8080;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World the server is live");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Complaint Management API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/users", userRoutes);

const startServer = async () => {
  try {
    await connectDB();
    await connectCloudinary();

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
};

startServer();