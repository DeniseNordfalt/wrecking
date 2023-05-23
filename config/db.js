import { connect } from "mongoose";
import { seed } from "./seed.js";

export const setupMongoDb = async (url) => {
  try {
    await connect(url);
    console.log("Connected to MongoDB successfully");
    await seed();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};
