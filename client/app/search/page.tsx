"use client";
import { Input } from "@/components/ui/input";
import { VideoCard } from "@/components/VideoCard";
import { useDebounce } from "@/hooks/useDebounce";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { api } from "@/lib/api";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

export default function SearchPage() {
  return (
    <Suspense fallback={<p>Loading search...</p>}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const params = useSearchParams();
  const router = useRouter();
  const initialQ = params.get("q") || "";

  const [input, setInput] = useState(initialQ);
  const debouncedInput = useDebounce(input, 400);

  const [videos, setVideos] = useState<any[]>([]);
  const [pageToken, setPageToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (debouncedInput && debouncedInput !== params.get("q")) {
      router.replace(`/search?q=${encodeURIComponent(debouncedInput)}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const loadResults = useCallback(
    async (reset = false) => {
      if (!debouncedInput || loading || (done && !reset)) return;
      setLoading(true);
      const res = await api.get("/youtube/search", {
        params: { q: debouncedInput, pageToken: reset ? undefined : pageToken },
      });
      setVideos((prev) =>
        reset ? res.data.items : [...prev, ...res.data.items],
      );
      setPageToken(res.data.nextPageToken);
      setDone(!res.data.nextPageToken);
      setLoading(false);
    },
    [debouncedInput, pageToken, loading, done],
  );

  useEffect(() => {
    setVideos([]);
    setPageToken(undefined);
    setDone(false);
    loadResults(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedInput]);

  const sentinelRef = useInfiniteScroll(() => loadResults(), !loading && !done);

  return (
    <div>
      <div className="relative mb-4 max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search videos"
          className="pl-9"
        />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {videos.map((v) => (
          <VideoCard
            key={v.id.videoId}
            videoId={v.id.videoId}
            title={v.snippet.title}
            thumbnail={v.snippet.thumbnails.medium.url}
            channelTitle={v.snippet.channelTitle}
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
