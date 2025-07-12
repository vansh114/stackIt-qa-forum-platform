const mongoose = require('mongoose');

// const mongoURI = "mongodb://localhost:27017/stackit";
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async () => {
  if (!mongoURI) {
    console.error("MONGO_URI is undefined. Check your .env file.");
    return;
  }
    try {
        await mongoose.connect(mongoURI);
        console.log("Connected to MongoDB Successfully");
    }
    catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectToMongo;