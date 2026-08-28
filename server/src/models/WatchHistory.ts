import { Schema, model, Types } from "mongoose";

export interface IWatchHistory {
  user: Types.ObjectId;
  videoId: string;
  title: string;
  thumbnail: string;
  watchedAt: Date;
}

const watchHistorySchema = new Schema<IWatchHistory>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  videoId: { type: String, required: true },
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  watchedAt: { type: Date, default: Date.now },
});

watchHistorySchema.index({ user: 1, videoId: 1 }, { unique: true });

export const WatchHistory = model<IWatchHistory>("WatchHistory", watchHistorySchema);