const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  name: {
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
});

module.exports = mongoose.model("file", FileSchema);
