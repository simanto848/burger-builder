import mongoose from "mongoose";

const dbConfig = () => {
  try {
    const db = mongoose.connect(process.env.MONGO_URL);
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.log("Error in connecting to database: ", error);
  }
};

export default dbConfig;
