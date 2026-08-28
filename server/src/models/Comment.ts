import { Document, Schema, Types, model } from "mongoose";

export interface IComment extends Document {
  user: Types.ObjectId;
  videoId: string;
  text: string;
  rating: number;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  videoId: { type: String, required: true, index: true },
  text: { type: String, required: true, trim: true, maxlength: 1000 },
  rating: { type: Number, required: true, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
});

export const Comment = model<IComment>("Comment", commentSchema);
