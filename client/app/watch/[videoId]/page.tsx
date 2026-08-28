"use client";

import { CommentSection } from "@/components/CommentSection";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { api } from "@/lib/api";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    api.get(`/youtube/video/${videoId}`).then((res) => setVideo(res.data));
    api
      .get(`/youtube/video/${videoId}/related`)
      .then((res) => setRelated(res.data.items));
  }, [videoId]);

  useEffect(() => {
    if (!video) return;
    api
      .post("/history", {
        videoId,
        title: video.snippet.title,
        thumbnail: video.snippet.thumbnails.medium.url,
      })
      .catch(() => {}); // not logged in, or write failed — fail silently
  }, [video, videoId]);

  async function toggleFavorite() {
    if (!video) return;
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${videoId}`);
      } else {
        await api.post("/favorites", {
          videoId,
          title: video.snippet.title,
          thumbnail: video.snippet.thumbnails.medium.url,
        });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error(err);
    }
  }

  if (!video) return <p>Loading...</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <VideoPlayer videoId={videoId} />
        <h1 className="mt-3 text-lg font-semibold">{video.snippet.title}</h1>
        <div className="mt-1 flex items-center justify-between text-sm text-gray-600">
          <span>{video.snippet.channelTitle}</span>
          <button
            onClick={toggleFavorite}
            className={`rounded-full px-4 py-1 ${isFavorite ? "bg-black text-white" : "bg-gray-100"}`}
          >
            {isFavorite ? "Saved" : "Save"}
          </button>
        </div>
        <CommentSection videoId={videoId} />
      </div>

      <div className="space-y-3">
        {related.map((v) => (
          <VideoCard
            key={v.id.videoId}
            videoId={v.id.videoId}
            title={v.snippet.title}
            thumbnail={v.snippet.thumbnails.medium.url}
            channelTitle={v.snippet.channelTitle}
          />
        ))}
      </div>
    </div>
  );
}
