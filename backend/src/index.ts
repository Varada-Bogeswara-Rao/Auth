import  Express  from "express";
 import { connectDB } from "./db/connectDB";
 import routes from "./routes/routes";
 import dotenv from "dotenv";
 import cookieParser = require("cookie-parser");

 dotenv.config();
const app = Express();
const port = process.env.PORT || 5000;

app.use(Express.json());
app.use(cookieParser());
app.use("/api/auth",routes);
app.listen(port,() => {
    connectDB();
    
    console.log(`Server is running on port ${port}`);
});