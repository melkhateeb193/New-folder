import mongoose from "mongoose";

const connectionDB = async () => {
  await mongoose
    .connect(process.env.URL_CONNECTIONS)
    .then(() => {
      console.log("Connected to MongoDB...");
    })
    .catch((err) => console.log(err));
};

export default connectionDB;
