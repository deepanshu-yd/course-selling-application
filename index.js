require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const app = express()
require("./db");
app.use(express.json());

// bcrypt for password hashing, zod to validate the user input, jsonwebtoken to create a jwt for a user

app.use(express.json());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB successfully");

    app.listen(3000);
    console.log("Server is listening on port 3000");
  } catch (error) {
    console.log("MongoDB connection error:", error.message);
    console.log("Starting server without database connection...");

    app.listen(3000);
    console.log("Server is listening on port 3000 (without database)");
  }
}

main()