export {};

import { app } from "./server";
import mongoose from "mongoose";
require("dotenv").config();

const port = process.env.PORT || 5000;

const init = async () => {
  try {
    const client = await mongoose.connect(process.env.DB_URI);
    console.log("connected to db");
    app.listen(port, () => console.log(`server is listening on ${port}`));
  } catch (err) {
    console.error("Error initializing");
    process.exit(1);
  }
};

init();
