import  Express  from "express";
import {login,logout, signup,verifyEmail,forgotPassword,resetPassword,checkAuth } from "../controllers/controllers";

import { verifyToken } from "../middleware/verifyToken";

const router = Express.Router();

router.post("/logout", logout);
router.post("/signup", signup);
router.post("/login", login);
router.post("/verifyEmail", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.get("/check-auth", verifyToken, checkAuth);

export default router;