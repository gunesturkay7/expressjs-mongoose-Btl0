import { Document, Schema, model, Types } from "mongoose";

export interface ITenant extends Document {
  user: Types.ObjectId; // Kullanıcı referansı
  name: string;
  address: string;
  // Diğer özellikler
}

const TenantSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  // Diğer alanlar
});

export const Tenant = model<ITenant>("Tenant", TenantSchema);
