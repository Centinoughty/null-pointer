const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");
require("dotenv").config();

// Initialization
const app = express();
const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = path.join(__dirname, "uploads");
const MAX_FILE_SIZE = 2 * 1024 * 1024;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Middlewares
app.use("/uploads", express.static(UPLOAD_DIR));

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const extName = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extName);

    let fileName = file.originalname;
    let counter = 1;
    while (fs.existsSync(path.join(UPLOAD_DIR, fileName))) {
      fileName = `${baseName}${counter}${extName}`;
      counter++;
    }

    cb(null, fileName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/x-dosexec",
      "application/java-archive",
      "application/java-vm",
    ];

    cb(null, !allowedTypes.includes(file.mimetype));
  },
});

// Routes
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileURL = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.status(201).send(fileURL);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
