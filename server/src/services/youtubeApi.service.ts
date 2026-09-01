import axios from "axios";
import { env } from "../config/env";

const BASE_URL = "https://www.googleapis.com/youtube/v3";

const yt = axios.create({
  baseURL: BASE_URL,
  params: { key: env.youtubeApiKey },
});

function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  const hours = parseInt(match?.[1] || "0", 10);
  const minutes = parseInt(match?.[2] || "0", 10);
  const seconds = parseInt(match?.[3] || "0", 10);
  const pad = (n: number) => String(n).padStart(2, "0");
  return hours > 0
    ? `${hours}:${pad(minutes)}:${pad(seconds)}`
    : `${minutes}:${pad(seconds)}`;
}

async function getVideoDurations(
  videoIds: string[],
): Promise<Record<string, string>> {
  if (videoIds.length === 0) return {};
  const { data } = await yt.get("/videos", {
    params: { part: "contentDetails", id: videoIds.join(",") },
  });
  const map: Record<string, string> = {};
  for (const item of data.items) map[item.id] = item.contentDetails.duration;
  return map;
}

async function attachDurations(items: any[], getId: (item: any) => string) {
  const ids = items.map(getId).filter(Boolean);
  const durations = await getVideoDurations(ids);
  return items.map((item: any) => ({
    ...item,
    durationText: formatDuration(durations[getId(item)] || "PT0S"),
  }));
}

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
  data.items = await attachDurations(
    data.items,
    (item: any) => item.id.videoId,
  );
  return data;
}

export async function getPopularVideos(
  categoryId?: string,
  pageToken?: string,
) {
  const { data } = await yt.get("/videos", {
    params: {
      part: "snippet,statistics,contentDetails",
      chart: "mostPopular",
      regionCode: "US",
      maxResults: 12,
      videoCategoryId: categoryId,
      pageToken,
    },
  });
  data.items = data.items.map((item: any) => ({
    ...item,
    durationText: formatDuration(item.contentDetails?.duration || "PT0S"),
  }));
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
  data.items = await attachDurations(
    data.items,
    (item: any) => item.id.videoId,
  );
  return data;
}
