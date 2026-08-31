"use client";

import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import { api } from "@/lib/api";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

interface Suggestion {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export function SearchBar() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounced = useDebounce(value, 500);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounced.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    api
      .get("/youtube/search", { params: { q: debounced } })
      .then((res) => {
        setSuggestions(
          res.data.items.slice(0, 5).map((v: any) => ({
            videoId: v.id.videoId,
            title: v.snippet.title,
            thumbnail: v.snippet.thumbnails.default.url,
            channelTitle: v.snippet.channelTitle,
          })),
        );
      })
      .catch(() => setSuggestions([]));
  }, [debounced]);

  function goToSearch(q: string) {
    if (!q.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-lg">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch(value);
        }}
        className="relative"
      >
        <button
          type="submit"
          aria-label="Search"
          className="absolute left-2 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Search className="size-4" />
        </button>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Search videos"
          className="pl-10"
        />
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-1.5 w-full overflow-hidden rounded-lg border bg-popover shadow-lg">
          {suggestions.map((s) => (
            <button
              key={s.videoId}
              onClick={() => {
                setOpen(false);
                router.push(`/watch/${s.videoId}`);
              }}
              className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-muted"
            >
              <img
                src={s.thumbnail}
                alt=""
                className="h-9 w-16 shrink-0 rounded object-cover"
              />
              <span className="min-w-0">
                <span className="block truncate text-sm">{s.title}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {s.channelTitle}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
