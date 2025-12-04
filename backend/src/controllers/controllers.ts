import User from "../model/model";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie";
import { sendVerificationEmail } from "../mailtrap/mail";

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
};

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

