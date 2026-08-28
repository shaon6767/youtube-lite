import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { Comment } from "../models/Comment";

export async function addComment(req: AuthRequest, res: Response) {
  const { videoId, text, rating } = req.body;
  if (!videoId || !text || !rating) {
    return res
      .status(400)
      .json({ message: "videoId, text and rating are required" });
  }
  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const comment = await Comment.create({
    user: req.userId,
    videoId,
    text,
    rating,
  });
  const populated = await comment.populate("user", "name");
  res.status(201).json(populated);
}

export async function getComments(req: AuthRequest, res: Response) {
  const comments = await Comment.find({ videoId: req.params.videoId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json(comments);
}

export async function deleteComment(req: AuthRequest, res: Response) {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });
  if (comment.user.toString() !== req.userId) {
    return res.status(403).json({ message: "Not your comment" });
  }
  await comment.deleteOne();
  res.status(204).send();
}
