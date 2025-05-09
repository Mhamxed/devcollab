import mongoose, { Document, Schema } from "mongoose";

// Extend Mongoose Document to type the model
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  firstname: string;
  lastname: string;
  username: string;
  password: string;
}

// Define the schema
const userSchema = new Schema<IUser>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create and export the model
const UserModel = mongoose.model<IUser>("User", userSchema);
export default UserModel;
