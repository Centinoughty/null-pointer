const express = require("express");
const path = require("path");
const { connectDb } = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
const UPLOAD_DIR = path.join(__dirname, "uploads");

connectDb();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
