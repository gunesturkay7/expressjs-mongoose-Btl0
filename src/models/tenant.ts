import { Document, Schema, model, Types } from "mongoose";

export interface ITenant extends Document {
  user: Types.ObjectId;
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  leaseStartDate: Date;
  leaseEndDate: Date;
  rentAmount: Number;
  securityDeposit: Number;
  rentDueDate: Date;
  emergencyContact: string;
  rentalHistory: string;
  notes: string;
}

const TenantSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true },
  leaseStartDate: { type: Date, required: true },
  leaseEndDate: { type: Date, required: true },
  rentAmount: { type: Number, required: true },
  securityDeposit: { type: Number, required: true },
  rentDueDate: { type: Date, required: true },
  emergencyContact: { type: String, required: false },
  rentalHistory: { type: String, required: false },
  notes: { type: String, required: false },
});

export const Tenant = model<ITenant>("Tenant", TenantSchema);
