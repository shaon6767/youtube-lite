import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Favorite } from "../models/Favorite";

export async function addFavorite(req: AuthRequest, res: Response) {
  const { videoId, title, thumbnail } = req.body;
  if (!videoId || !title || !thumbnail) {
    return res
      .status(400)
      .json({ message: "videoId, title and thumbnail are required" });
  }

  try {
    const favorite = await Favorite.create({
      user: req.userId,
      videoId,
      title,
      thumbnail,
    });
    res.status(201).json(favorite);
  } catch (err: any) {
    if (err.code === 11000)
      return res.status(409).json({ message: "Already in favorites" });
    throw err;
  }
}

export async function removeFavorite(req: AuthRequest, res: Response) {
  await Favorite.deleteOne({ user: req.userId, videoId: req.params.videoId });
  res.status(204).send();
}

export async function getFavorites(req: AuthRequest, res: Response) {
  const favorites = await Favorite.find({ user: req.userId }).sort({
    addedAt: -1,
  });
  res.json(favorites);
}
