import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "16kb" })); //returns a middleware that parses json data and setting a limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public")); //to store static assets
app.use(cookieParser());
export default { app };
