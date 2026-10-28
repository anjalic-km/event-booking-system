
const mongoose = require("mongoose");

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB error name:", error.name);
    console.error("MongoDB error message:", error.message);

    if (error.reason?.servers) {
      for (const [address, server] of error.reason.servers) {
        console.error("Server:", address);
        console.error("Server error:", server.error?.message);
        console.error("Server type:", server.type);
      }
    }

    throw error;
  }
};

module.exports = { connectMongoDB };
