import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// Extend the Request interface so we can attach the userId to it
export interface AuthenticatedRequest extends Request {
    userId?: string;
}

export const verifyToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1. Grab the token from the cookie
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ success: false, message: "Unauthorized - No Token Provided" });
    }

    try {
        // 2. Decode the token (Read the secret stamp)
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized - Invalid Token" });
        }

        // 3. Attach the user ID to the request
        // This effectively "passes the ID" to the next function
        req.userId = decoded.userId;

        // 4. THE MAGIC KEYWORD: Let the request move to the next function
        next(); 
    } catch (error) {
        console.log("Error in verifyToken", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}