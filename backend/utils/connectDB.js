import mongoose from "mongoose";
import env from 'dotenv';

env.config();

export default async function connectDB() {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(process.env.MONGO_URI);

    //this point
    console.log("connected to DB");
  } catch (err) {
    console.error("Error in connecting db:", err);
  }
}
