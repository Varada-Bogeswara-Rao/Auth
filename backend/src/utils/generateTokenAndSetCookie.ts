import { Response } from "express";
import jwt from "jsonwebtoken";

export const generateTokenAndSetCookie = (res: Response, userId: string) => {
    const secret = process.env.JWT_SECRET;

    // Safety check for TS
    if (!secret) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const token = jwt.sign({ userId }, secret, {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true, // Prevent XSS
        secure: process.env.NODE_ENV === "production", // HTTPS only in production
        sameSite: "strict", // Prevent CSRF
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};