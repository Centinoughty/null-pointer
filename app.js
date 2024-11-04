const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

// Initialization
const app = express();
const PORT = process.env.PORT || 5000;
const MAX_FILE_SIZE = 256 * 1024 * 1024;
const UPLOAD_DIR = path.join(__dirname, "uploads");
const EXP_DURATION = 30 * 24 * 60 * 60 * 1000;

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// File Management Functions
const isExpired = (filePath, expirationDuration) => {
  const stats = fs.statSync(filePath);
  return Date.now() - stats.mtimeMs > expirationDuration;
};
const generateFileName = (originalName) =>
  `${uuidv4()}${path.extname(originalName)}`;
const saveFileRecord = (fileName, expirationDuration) => {};

// Middlewares
app.use(express.static(path.join(__dirname, "public")));

// Multer Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, generateFileName(file.originalname)),
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

// File Upload Route
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const expires = req.body.expires
    ? parseInt(req.body.expires)
    : Date.now() + EXP_DURATION;

  saveFileRecord(req.file.filename, expires);

  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  res.json({ url: fileUrl });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
