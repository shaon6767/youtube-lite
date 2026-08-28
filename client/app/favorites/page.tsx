"use client";

import { VideoCard } from "@/components/VideoCard";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function FavoritesPage() {
  const [videos, setVideos] = useState<any[]>([]);

  useEffect(() => {
    api.get("/favorites").then((res) => setVideos(res.data));
  }, []);

  return (
    <div>
      <h1 className="mb-4 text-lg font-semibold">Favorites</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((v) => (
          <VideoCard
            key={v.videoId}
            videoId={v.videoId}
            title={v.title}
            thumbnail={v.thumbnail}
          />
        ))}
      </div>
    </div>
  );
}
