import { Request, Response } from "express";
import * as youtube from "../services/youtubeApi.service";

export async function search(req: Request, res: Response) {
  const { q, pageToken } = req.query;
  if (!q || typeof q !== "string") {
    return res.status(400).json({ message: "Query param 'q' is required" });
  }
  try {
    const data = await youtube.searchVideos(q, pageToken as string | undefined);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "YouTube API request failed" });
  }
}

export async function popular(req: Request, res: Response) {
  const { categoryId, pageToken } = req.query;
  try {
    const data = await youtube.getPopularVideos(
      categoryId as string | undefined,
      pageToken as string | undefined,
    );
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "YouTube API request failed" });
  }
}

export async function videoDetails(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  const { videoId } = req.params;
  try {
    const video = await youtube.getVideoById(videoId);
    if (!video) return res.status(404).json({ message: "Video not found" });
    res.json(video);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "YouTube API request failed" });
  }
}

export async function related(
  req: Request<{ videoId: string }>,
  res: Response,
) {
  const { videoId } = req.params;
  try {
    const data = await youtube.getRelatedVideos(videoId);
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "YouTube API request failed" });
  }
}

export async function categories(_req: Request, res: Response) {
  try {
    const data = await youtube.getCategories();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(502).json({ message: "YouTube API request failed" });
  }
}
