// controllers/otpController.ts
import { Request, Response } from "express";
import OTP from "../models/OTP";
import twilio from "twilio";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Nodemailer SMTP Konfigürasyonu
const transporter = nodemailer.createTransport({
  service: "gmail", // E-posta servisi
  auth: {
    user: process.env.EMAIL_USER, // E-posta adresiniz
    pass: process.env.EMAIL_PASS, // E-posta şifreniz
  },
});

export const sendOtp = async (req: Request, res: Response) => {
  const { email } = req.body as { email: string };
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresIn = 15 * 60000; // OTP'nin geçerlilik süresi (15 dakika)

  try {
    await OTP.deleteMany({ email });
    const expiresAt = new Date(Date.now() + expiresIn);
    const newOtp = new OTP({ email, code, expiresAt });
    await newOtp.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is: ${code}. It will expire in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // Response'a OTP'nin geçerlilik süresini ve e-posta bilgisini de ekleyin
    res.status(200).json({
      message: "OTP sent successfully",
      expiresIn: expiresIn,
      email: email,
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).send("Error sending OTP");
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  const { email, code } = req.body as { email: string; code: string };

  if (!email || !code) {
    return res.status(400).send("Missing email or code in request body");
  }

  console.log("Verifying OTP for email:", email);

  try {
    const otp = await OTP.findOne({
      email,
      code,
      expiresAt: { $gt: new Date() }, // Consider specifying timezone if necessary
    });

    if (otp) {
      res.status(200).send("OTP verified successfully");
      await OTP.deleteOne({ _id: otp._id });
    } else {
      res.status(400).send("Invalid OTP or OTP expired");
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send("Internal server error during OTP verification");
  }
};
