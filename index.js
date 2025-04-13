const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieSession = require("cookie-session");
const connectDB = require("./config/db");

const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const newsRouter = require("./routes/newsRoute");
const commentRouter = require("./routes/commentRoute");

const app = express();
dotenv.config();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET, POST, PUT, DELETE",
      credentials: true,
      exposedHeaders: ['Authorization'],
      allowedHeaders: ['Content-Type', 'Authorization']
    })
  );
  
app.use(
    cookieSession({
      name: "session",
      keys: ["randomkey"],
      maxAge: 24 * 60 * 60 * 1000,
    })
  );
// Database connection
connectDB();

// Routes
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/news", newsRouter);
app.use("/api/comments", commentRouter);

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:${port}`);
});