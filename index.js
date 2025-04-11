
import express from "express"
import dotenv from "dotenv";
dotenv.config({
  path:'./.env'
})
import {app} from "./app.js"
import connectToDB from "./db/index.js";

// app.get("/:data",(req,res)=>{
//     console.log(req.params);
    
// res.status(200).json({data:req.params})
// })
const startServer = async () => {
    try {
      await connectToDB();  // Ensure DB connection is established
  
      app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on port ${process.env.PORT || 3000}`);
      });
    } catch (error) {
      console.error("Error during startup", error);
      process.exit(1);  // Exit the process if there are any issues with DB or server
    }
  };
  
  startServer();
