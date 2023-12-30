import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/user";
import { IUser } from "../models/user"; // assuming IUser is your user interface

// Extend the Express request to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "No token provided" });
      return;
    }

    console.log(token);

    // Use environment variable for JWT secret
    const secret = "asdasdsadasd";
    if (!secret) {
      res.status(500).json({ message: "Internal server error" });
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
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" });
    } else {
      res.status(401).json({ message: "Authentication failed", error: (error as Error).message });
    }
    return;
  }
};

export default authenticate;
