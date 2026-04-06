import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

let localConnection = process.env.LOCALDBCONNECTIONSTRING;

export const databaseConnection = () => {
  try {
    mongoose.connect(localConnection);
    console.log("database connected successfully!");
  } catch (err) {
    console.log("DB Error:", err);
    process.exit(1);
  }
};
