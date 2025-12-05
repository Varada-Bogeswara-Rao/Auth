import User from "../model/model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { sendVerificationEmail,sendPasswordResetEmail,sendResetSuccessEmail } from "../mailtrap/mail";
import { AuthenticatedRequest } from "../middleware/verifyToken";


export const signup = async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All fields are required");
        }

        const userAlreadyExists = await User.findOne({ email });
        console.log("userAlreadyExists", userAlreadyExists);

        if (userAlreadyExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashedPassword,
            name,
            verificationToken,
            verificationTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
        });

        await user.save();

        // jwt
        generateTokenAndSetCookie(res, user.id);

        await sendVerificationEmail(user.email, verificationToken);


        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
    }
}
export const verifyEmail = async (req: Request, res: Response) => {

    try {
        console.log("Full Request Body:", req.body);
        const { code } = req.body;
        console.log("Extracted code:", code);
        const cleanCode = code.trim();
        const user = await User.findOne({
            verificationToken: cleanCode,
            verificationTokenExpires: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
        }
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        user.isVerified = true;
        await user.save();
        res.status(200).json({ success: true, message: "Email verified successfully" });
    }
    catch (error) {

        console.log(error);
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
    }


}
export const logout = async (req: Request, res: Response) => {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
}
export const login = async (req: Request, res: Response) => {

    const { email, password } = req.body;
    try{
   

        const user = await User.findOne({ email });
        if (!user ) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }
        if(!user.isVerified){
            return res.status(400).json({ success: false, message: "Email not verified. Please verify your email before logging in." });
        }
       const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        } 
        generateTokenAndSetCookie(res, user.id);
        user.lastLogin = new Date();
        await user.save();
        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user.toObject(),
                password: undefined,
            },
        }); 
    }
    catch (error) {
        res.status(500).json({ success: false, message: error instanceof Error ? error.message : "An error occurred" });
    }
}
export const forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); 
        user.resetpasswordToken = resetToken;
        user.resetpasswordExpires = resetTokenExpiresAt;

        await user.save();
        await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
        
        console.log(`Reset Token generated: ${resetToken}`); // For testing without email

        res.status(200).json({ success: true, message: "Password reset link sent to your email" });
    } catch (error) {
        console.log("Error in forgotPassword", error);
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Error" });
    }
}

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;
        const { password } = req.body;

        const user = await User.findOne({ resetpasswordToken: token });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        }

        // FIX: Check expiration using JavaScript instead of MongoDB
        // user.resetPasswordExpiresAt is a Date object. Date.now() is a number.
        // We convert both to numbers to compare safely.
        const isExpired = !user.resetpasswordExpires || user.resetpasswordExpires.getTime() < Date.now();

        if (isExpired) {
            return res.status(400).json({ success: false, message: "Token expired" });
        }

        // Hash the NEW password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetpasswordToken = undefined;
        user.resetpasswordExpires = undefined;

        await user.save();

        res.status(200).json({ success: true, message: "Password reset successfully" });
    } catch (error) {
        console.log("Error in resetPassword", error);
        res.status(400).json({ success: false, message: error instanceof Error ? error.message : "Error" });
    }
}


export const checkAuth = async (req: AuthenticatedRequest, res: Response) => {
    try {
    
        const user = await User.findById(req.userId).select("-password"); 

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth", error);
        res.status(400).json({ success: false, message: "Error in checkAuth" });
    }
}