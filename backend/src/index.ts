import  Express  from "express";
 import { connectDB } from "./db/connectDB";
 import routes from "./routes/routes";
 import dotenv from "dotenv";
 import cors from "cors";
 import cookieParser = require("cookie-parser");

 dotenv.config();
const app = Express();
const port = process.env.PORT || 5000;
app.use(cors({
    origin: "http://localhost:5173", // Allow your frontend URL
    credentials: true, // Allow cookies to be sent
}));
app.use(Express.json());
app.use(cookieParser());
app.use("/api/auth",routes);
app.listen(port,() => {
    connectDB();
    
    console.log(`Server is running on port ${port}`);
});