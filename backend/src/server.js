import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth-routes.js"
import messageRoutes from "./routes/message-routes.js"
import { connectDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js"


dotenv.config();


const PORT =process.env.PORT || 5001 ;
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({extended:true,limit:'10mb'}));
app.use(cookieParser());

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

//auth routes
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);

connectDB().then(() => {
    server.listen(PORT,() => {
    console.log(`Server now is Running on http://localhost:${PORT}`);
});
}).catch((error) => {
    console.error("Failed to connect to database:", error);
    process.exit(1);
});


