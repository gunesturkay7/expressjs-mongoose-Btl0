import mongoose, { Document } from "mongoose";

interface IOTP extends Document {
  email: string; // Changed from phoneNumber to email
  code: string;
  expiresAt: Date;
}

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // Changed field
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true, default: () => new Date(+new Date() + 30 * 60 * 1000) },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTP = mongoose.model<IOTP>("OTP", otpSchema);
export default OTP;
