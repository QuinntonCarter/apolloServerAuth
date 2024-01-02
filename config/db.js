import mongoose from "mongoose";

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  // const conn = await mongoose.connect(
  //   "mongodb://localhost:27017/apolloServerDB"
  // );
  console.log(`MongoDB Connected ${conn.connection.host}`.cyan.underline.bold);
};

export default connectDB;
