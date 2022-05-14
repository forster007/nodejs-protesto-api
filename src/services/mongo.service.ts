import mongoose from "mongoose";

const mongoService = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
  } catch (err) {
    process.exit(1);
  }
};

export default mongoService;
