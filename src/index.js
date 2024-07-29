import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});
//asynchronous functions returns a promise after completion
//and try/catch can be used on them here connectDB()
// is an asynchronous function
connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(`The app ran into an error : ${error}`);
      throw error;
    });

    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server active at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed Error: ", error);
  });
