import mongoose, { mongo } from "mongoose";

function connectToDB() {
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => {
      console.log(`Connected to DB, successfully`);
    })
    .catch((error) => {
      console.log(`Error while connecting to DB ${error}`);
      process.exit(1);
    });
}

export default connectToDB;
