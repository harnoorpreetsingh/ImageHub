import express from "express";
import cloudinary from "cloudinary";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connect } from "mongoose";
import connectDb from "./database/db.js";

dotenv.config();


cloudinary.v2.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Api,
  api_secret: process.env.Cloud_Secret,
});

const app = express();

app.use(express.static('public'))
const PORT = process.env.PORT;

//using middleware

app.use(express.json()); //to take json value from user
app.use(cookieParser()); //to take json value from user

app.get("/", (req, res)=>{
    res.send("Hello, World!")
})

//importing routes

import userRoutes from "./routes/userRoutes.js";
import pinRoutes from "./routes/pinRoutes.js";

app.use("/api/user", userRoutes); //api is just a prefix will be used with every route
app.use("/api/pin", pinRoutes); //api is just a prefix will be used with every route

app.listen(PORT, () => {
  console.log(`Server running at port http://localhost:${PORT}`);
  connectDb();
});
