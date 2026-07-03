// import dotenv from "dotenv";
// import mongoose from "mongoose";

// dotenv.config();

// const mongoUri = process.env.MONGODB;

// export const initializeDatabase = async () => {
//   try {
//     console.log(process.env.MONGODB)
//     await mongoose.connect(mongoUri);
//     console.log("Connected to Database");
//   } catch (error) {
//     console.log("Error connecting to Database", error);
//   }
// };



import mongoose from "mongoose";

// We keep a variable outside the function to store the active connection
let isConnected = false;

export const initializeDatabase = async () => {
  // 1. If already connected, reuse the connection instead of creating a new one
  if (isConnected) {
    console.log("Reusing existing database connection");
    return;
  }

  const mongoUri = process.env.MONGODB;

  if (!mongoUri) {
    console.error("CRITICAL: process.env.MONGODB is undefined! Check your Vercel Project Settings.");
    throw new Error("Database URI is missing.");
  }

  try {
    console.log("Attempting to connect to MongoDB...");
    
    const db = await mongoose.connect(mongoUri, {
      bufferCommands: false, // Stops the 10-second freeze; fails immediately if connection breaks
    });

    // 2. Track connection state
    isConnected = db.connections[0].readyState === 1;
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error("Error connecting to Database:", error);
    throw error;
  }
};