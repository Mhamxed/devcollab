import mongoose, { Schema, Document, Types } from "mongoose";

export interface IInterview extends Document {
  title: string;
  description: string;
  createdBy: Types.ObjectId;
  participants: Types.ObjectId[];
  scheduledFor: Date;
  status: "scheduled" | "active" | "completed";
  roomId: string;
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    scheduledFor: { type: Date, required: true },
    status: {
      type: String,
      enum: ["scheduled", "active", "completed"],
      default: "scheduled",
    },
    roomId: { type: String, required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
  }
);

const InterviewModel = mongoose.model<IInterview>("Interview", interviewSchema);
export default InterviewModel;
