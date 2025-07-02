import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    // origin: process.env.CORS_ORIGIN,
    // credentials:true
}))
app.use(express.json({limit:"200kb"}))
app.use(cookieParser())
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));

import userRoutes from "./routes/user.routes.js"
app.use('/',userRoutes)

export {app};