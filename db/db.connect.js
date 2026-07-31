import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const mongoUri = process.env.MONGODB;
let isConnected = false;

export const initializeDatabase = async () => {
  if (isConnected) return; // reuse existing connection, don't reconnect every request

  try {
    await mongoose.connect(mongoUri);
    isConnected = true;
    console.log("Connected to Database");
  } catch (error) {
    console.log("Error connecting to Database", error);
    throw error;
  }
};