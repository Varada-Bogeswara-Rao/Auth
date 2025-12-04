import  Express  from "express";
import {login,logout, signup,verifyEmail } from "../controllers/controllers";

const router = Express.Router();

router.post("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);
router.post("/verifyEmail", verifyEmail);
export default router;