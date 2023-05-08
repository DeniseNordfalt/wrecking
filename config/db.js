import { connect } from "mongoose";

export const setupMongoDb = async (url) => {
  try {
    await connect(url);
    console.log("Connected to MongoDB successfully");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};
