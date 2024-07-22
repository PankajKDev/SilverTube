import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
  path: "./env",
});
connectDB();

// single page approach
// import express from "exxpress";
// const app = express()(async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     app.on("Error", (error) => {
//       console.log("The app encountered an error Please try later", error);
//       throw error;
//     });
//     app.listen(process.env.PORT, () => {
//       console.log(
//         `App is listening on port http://localhost:${process.env.PORT}`
//       );
//     });
//   } catch (error) {
//     console.log("Encountered an error :", error);
//     throw error;
//   }
// })();
