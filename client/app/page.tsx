"use client";

import { CategoryTabs } from "@/components/CategoryTabs";
import { VideoCard } from "@/components/VideoCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { api } from "@/lib/api";
import { useCallback, useEffect, useState } from "react";

export default function HomePage() {
  const [videos, setVideos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.get("/youtube/categories").then((res) =>
      setCategories(
        res.data.items.map((c: any) => ({
          id: c.id,
          title: c.snippet.title,
        })),
      ),
    );
  }, []);

  const loadVideos = useCallback(
    async (reset = false) => {
      if (loading || (done && !reset)) return;
      setLoading(true);
      const res = await api.get("/youtube/popular", {
        params: { categoryId, pageToken: reset ? undefined : pageToken },
      });
      setVideos((prev) =>
        reset ? res.data.items : [...prev, ...res.data.items],
      );
      setPageToken(res.data.nextPageToken);
      setDone(!res.data.nextPageToken);
      setLoading(false);
    },
    [categoryId, pageToken, loading, done],
  );

  useEffect(() => {
    setDone(false);
    setPageToken(undefined);
    loadVideos(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const sentinelRef = useInfiniteScroll(() => loadVideos(), !loading && !done);

  return (
    <div>
      <CategoryTabs
        categories={categories}
        activeId={categoryId}
        onSelect={setCategoryId}
      />
      <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((v) => (
          <VideoCard
            key={v.id}
            videoId={v.id}
            title={v.snippet.title}
            thumbnail={v.snippet.thumbnails.medium.url}
            channelTitle={v.snippet.channelTitle}
            durationText={v.durationText}
          />
        ))}
      </div>
      <div ref={sentinelRef} className="h-8" />
      {loading && (
        <p className="mt-4 text-center text-sm text-gray-500">Loading...</p>
      )}
    </div>
  );
}
