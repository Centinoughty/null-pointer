const express = require("express");
const path = require("path");
const fs = require("fs");
require("dotenv").config();
require("./tasks/cronTask");

const { connectDb } = require("./config/db");
const logRoute = require("./middlewares/logAccess");
const fileRoute = require("./route/file");
const logAccess = require("./middlewares/logAccess");

const app = express();
const PORT = process.env.PORT;
const UPLOAD_DIR = path.join(__dirname, "uploads");

// Storage Config
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

app.use(express.json());
app.use(logAccess);
app.use("/api/files", fileRoute);

connectDb();
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
