import { model, Schema, Document } from "mongoose";
import bcrypt from "bcrypt";

// Define an interface that extends Document for strong typing
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  userAvatar: string;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  userAvatar: {
    type: String,
    default: "https://via.placeholder.com/150",
  },
});

// Pre-save hook to hash the password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Create the model
const UserModel = model<IUser>("User", userSchema);

// Export the model and interface
export { UserModel, IUser };
