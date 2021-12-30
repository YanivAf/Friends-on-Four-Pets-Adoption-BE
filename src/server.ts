import express from "express";
export const app = express();
require("dotenv").config();
import cookieParser from "cookie-parser";

import path from "path";
const pathToFile = path.resolve(__dirname, "../public");

import cors from "cors";
const corsOptions = {
  credentials: true,
  origin: "http://localhost:3000",
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(pathToFile));
app.use(cors(corsOptions));

import userRoutes from "./routes/userRoutes";
import petRoutes from "./routes/petRoutes";

app.use("/user", userRoutes);
app.use("/pet", petRoutes);
