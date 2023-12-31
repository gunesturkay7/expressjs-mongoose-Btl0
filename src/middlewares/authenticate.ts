import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/user";
import { IUser } from "../models/user"; // assuming IUser is your user interface
import dotenv from "dotenv";

// Extend the Express request to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// ... (diğer importlar)

dotenv.config();

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ message: "JWT secret is not defined" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    const user = await UserModel.findById(decoded.id);

    if (!user) {
      res.status(401).json({ message: "Authentication failed" });
      return;
    }

    req.user = user as IUser;
    next();
  } catch (error: any) {
    // Daha ayrıntılı hata yönetimi
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(500).json({ message: "Error in authentication", error: error.message });
    }
    return;
  }
};

export default authenticate;
