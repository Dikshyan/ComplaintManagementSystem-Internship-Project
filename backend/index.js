require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./db/db");
const authRoutes = require("./routes/authRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const userRoutes = require("./routes/userRoutes");
const { connectCloudinary } = require("./config/cloudinary");

const app = express();
const port = process.env.PORT || 8080;

connectDB();
connectCloudinary();


app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World the server is live");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Complaint Management API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/complaint", complaintRoutes);
app.use("/api/users", userRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

