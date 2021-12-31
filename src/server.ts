import express from "express";
export const app = express();
require("dotenv").config();
import session from 'express-session';
import cookieParser from "cookie-parser";

import path from "path";
const pathToFile = path.resolve(__dirname, "../public");

import cors from "cors";
const corsOptions = {
  credentials: true,
  origin: process.env.ORIGIN || "http://localhost:3000",
  exposedHeaders: ["set-cookie"]
};

app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET || '123456',
    resave: true,
    saveUninitialized: false,
    cookie: {
      sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
      secure: process.env.NODE_ENV === "production",
      domain: process.env.ORIGIN || "http://localhost:3000"
    }
  })
);
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
