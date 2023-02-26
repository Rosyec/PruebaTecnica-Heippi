import mongoose from "mongoose";

mongoose.set("strictQuery", false);

mongoose
  .connect(`mongodb+srv://root:admin@cluster0.mfzggdc.mongodb.net/backend`)
  .then(() => {
    console.log("Connection DB Mongo - OK");
  })
  .catch((error) => console.log("Connection DB Mongo - Error: ", error));
