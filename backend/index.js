
import express from "express"
import dotenv from "dotenv";
dotenv.config({
  path: './.env'
})
import { app } from "./app.js"
import connectToDB from "./db/index.js";
import handleWs from "./webSocket.js";




const startServer = async () => {
  try {
    await connectToDB();  // Ensure DB connection is established

    const server = app.listen(process.env.PORT || 3001, () => {
      console.log(`Server is running on port ${process.env.PORT || 3001}`);
    });
    await handleWs(server)
  } catch (error) {
    console.error("Error during startup", error);
    process.exit(1);  // Exit the process if there are any issues with DB or server
  }
};

startServer();
