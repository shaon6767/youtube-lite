import axios from "axios";
import { env } from "../config/env";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const yt = axios.create({
  baseURL: BASE_URL,
  params: { key: env.youtubeApiKey },
});

export async function searchVideos(query: string, pageToken?: string) {
  const { data } = await yt.get("/search", {
    params: {
      part: "snippet",
      q: query,
      type: "video",
      maxResults: 12,
      pageToken,
    },
  });
  return data;
}

export async function getPopularVideos(
  categoryId?: string,
  pageToken?: string,
) {
  const { data } = await yt.get("/videos", {
    params: {
      part: "snippet,statistics",
      chart: "mostPopular",
      regionCode: "US",
      maxResults: 12,
      videoCategoryId: categoryId,
      pageToken,
    },
  });
  return data;
}

export async function getVideoById(videoId: string) {
  const { data } = await yt.get("/videos", {
    params: { part: "snippet,statistics,contentDetails", id: videoId },
  });
  return data.items?.[0] || null;
}

export async function getCategories(regionCode = "US") {
  const { data } = await yt.get("/videoCategories", {
    params: { part: "snippet", regionCode },
  });
  return data;
}

// YouTube removed the relatedToVideoId search param in Aug 2023.
// Workaround: pull the video's category, then search that category.
export async function getRelatedVideos(videoId: string) {
  const video = await getVideoById(videoId);
  if (!video) return { items: [] };

  const { data } = await yt.get("/search", {
    params: {
      part: "snippet",
      type: "video",
      videoCategoryId: video.snippet.categoryId,
      maxResults: 12,
      order: "relevance",
    },
  });

  data.items = data.items.filter((item: any) => item.id.videoId !== videoId);
  return data;
}
