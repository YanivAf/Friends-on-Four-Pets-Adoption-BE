import express from "express";
export const app = express();
require("dotenv").config();
import cookieParser from "cookie-parser";

import path from "path";
const pathToFile = path.resolve(__dirname, "../public");

import cors from "cors";
const corsOptions = {
  credentials: true,
  origin: process.env.ORIGIN || "http://localhost:3000",
  exposedHeaders: ["set-cookie"]
};

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(pathToFile));
app.use(cors(corsOptions));

import userRoutes from "./routes/userRoutes";
import petRoutes from "./routes/petRoutes";

app.get('/', (req, res) => {
  res.send({ foo: "bar", hello: "world", chuck: "norris", origin: corsOptions.origin });
});

app.use("/user", userRoutes);
app.use("/pet", petRoutes);
