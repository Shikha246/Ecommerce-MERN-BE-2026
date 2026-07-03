import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGODB;

export const initializeDatabase = async () => {
  try {
    console.log(process.env.MONGODB)
    await mongoose.connect(mongoUri);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error connecting to Database", error);
  }
};



