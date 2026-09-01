"use client";

import { CommentSection } from "@/components/CommentSection";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Heart } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function WatchPage() {
  const { videoId } = useParams<{ videoId: string }>();
  const { user } = useAuth();
  const router = useRouter();
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
      .catch(() => {});
  }, [video, videoId]);

  // was missing before — the button always said "Save" even if it was already favorited
  useEffect(() => {
    if (!user || !videoId) return;
    api
      .get("/favorites")
      .then((res) =>
        setIsFavorite(res.data.some((f: any) => f.videoId === videoId)),
      )
      .catch(() => {});
  }, [user, videoId]);

  async function toggleFavorite() {
    if (!video) return;
    if (!user) {
      router.push("/login");
      return;
    }
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

  if (!video) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Skeleton className="aspect-video w-full rounded-xl" />
          <Skeleton className="mt-4 h-6 w-2/3" />
          <Skeleton className="mt-2 h-4 w-1/3" />
        </div>
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <VideoPlayer videoId={videoId} />
        <h1 className="mt-3 text-lg font-semibold">{video.snippet.title}</h1>
        <div className="mt-2 flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-red-600 text-xs font-semibold text-white">
              {video.snippet.channelTitle.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm font-medium">
              {video.snippet.channelTitle}
            </span>
          </div>
          <Button
            onClick={toggleFavorite}
            variant={isFavorite ? "default" : "outline"}
            className={isFavorite ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Heart
              className={`mr-2 size-4 ${isFavorite ? "fill-white" : ""}`}
            />
            {isFavorite ? "Saved" : "Save"}
          </Button>
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
            durationText={v.durationText}
          />
        ))}
      </div>
    </div>
  );
}
