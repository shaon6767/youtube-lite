import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { WatchHistory } from "../models/WatchHistory";

export async function addToHistory(req: AuthRequest, res: Response) {
  const { videoId, title, thumbnail } = req.body;
  if (!videoId || !title || !thumbnail) {
    return res
      .status(400)
      .json({ message: "videoId, title and thumbnail are required" });
  }

  await WatchHistory.findOneAndUpdate(
    { user: req.userId, videoId },
    { title, thumbnail, watchedAt: new Date() },
    { upsert: true, returnDocument: "after" },
  );

  res.status(204).send();
}

export async function getHistory(req: AuthRequest, res: Response) {
  const history = await WatchHistory.find({ user: req.userId })
    .sort({ watchedAt: -1 })
    .limit(50);
  res.json(history);
}

export async function clearHistory(req: AuthRequest, res: Response) {
  await WatchHistory.deleteMany({ user: req.userId });
  res.status(204).send();
}
