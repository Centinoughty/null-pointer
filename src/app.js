const express = require("express");
const fs = require("fs");
const crypto = require("crypto");
require("dotenv").config({ path: ".env" });

const app = express();
const PORT = process.env.PORT;
const UPLOAD_DIR = "uploads";

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

const generateId = () => crypto.randomBytes(3).toString("hex");

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
