const cron = require("node-cron");
const File = require("../models/FileModel");

cron.schedule("* * * * *", async () => {
  console.log("Running cleanup");

  try {
    const now = new Date();
    const expiredFiles = await File.find({ expiry: { $lte: now } });

    for (const file of expiredFiles) {
      await File.findByIdAndDelete(file._id);

      console.log(`Deleted file: ${file.fileName}`);
    }
  } catch (error) {
    console.log(error);
  }
});
