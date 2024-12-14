const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema(
  {
    fileBlob: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    expiry: {
      type: String,
      required: true,
    },
    maxDownloads: {
      type: Number,
      default: 1,
    },
    downloads: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("file", FileSchema);
