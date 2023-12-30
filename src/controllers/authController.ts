import { UserModel, IUser } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

const generateToken = (user: IUser) => {
  // Destructure the password and rest of the user properties
  const { password, ...userInfoWithoutPassword } = user.toObject();

  // Sign the token with user information except password
  return jwt.sign(userInfoWithoutPassword, "asdasdsadasd", {
    expiresIn: "1h",
  });
};

const signUp = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const user: IUser = await UserModel.create({ username, email, password });

    const token = generateToken(user);

    res.status(201).json({ message: "User created successfully", token });
  } catch (error: any) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};

const signIn = async (req: Request, res: Response) => {
  try {
    console.log(req);
    const { username, password } = req.body;
    const user: IUser | null = await UserModel.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    res.status(200).json({ message: "Authentication successful", token, user });
  } catch (error: any) {
    res.status(500).json({ message: "Error signing in", error: error.message });
  }
};

export { signUp, signIn };
