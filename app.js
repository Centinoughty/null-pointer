const express = require("express");
const path = require("path");
const { connectDb } = require("./config/db");
require("dotenv").config();

const fileRoute = require("./route/file");

const app = express();
const PORT = process.env.PORT;
const UPLOAD_DIR = path.join(__dirname, "uploads");

app.use("/api/files", fileRoute);

connectDb();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
