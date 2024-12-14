const router = require("express").Router();
const multer = require("multer");
const File = require("../models/FileModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { parseExpiry } = require("../util/parseExpiry");

const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, cb) => {
    const uniqueName = `${crypto.randomUUID()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { fileName, expiry, maxDownloads, password } = req.body;
    const fileBlob = req.file.filename;

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const file = await File.create({
      fileBlob,
      fileName,
      expiry: new Date(Date.now() + parseExpiry(expiry)),
      maxDownloads: parseInt(maxDownloads, 10),
      password: hashedPassword,
    });

    res.status(201).json({ message: "Uploaded the file", fileId: file._id });
  } catch (error) {
    res.status(500).json({ message: "Internal Server" });
    console.log(error);
  }
});

router.post("/verify/:fileId", async (req, res) => {
  try {
    const { password, requesterId } = req.body;
    const { fileId } = req.params;

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "Cannot find the file" });
    }

    if (file.password && !(await bcrypt.compare(password, file.password))) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      {
        fileId,
        requesterId,
      },
      JWT_SECRET,
      { expiresIn: "10m" }
    );

    res.status(200).json({ message: "Access granted", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    console.log(error);
  }
});

router.get("/download/:fileId", async (req, res) => {
  try {
    const { fileId } = req.params;
    const authHeader = req.headers.authorization;

    if (
      !authHeader ||
      (authHeader.split(" ").length !== 2 && !authHeader.startsWith("Bearer "))
    ) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.fileId !== fileId) {
      return res.status(403).json({ message: "Access denied" });
    }

    const file = await File.findById(fileId);
    if (!file) {
      return res.status(400).json({ message: "Cannot find the file" });
    }

    if (new Date() > new Date(file.expiry)) {
      return res.status(410).json({ message: "File expired" });
    }

    if (file.downloads >= file.maxDownloads) {
      return res.status(403).json({ message: "Download limit reached" });
    }

    file.downloads += 1;
    await file.save();

    res.download(`./uploads/${file.fileBlob}`, file.fileName);
  } catch (error) {
    res.status(500).json({ message: "Invalid or token failed" });
    console.log(error);
  }
});

module.exports = router;
