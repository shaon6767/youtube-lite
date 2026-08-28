"use client";

interface Props {
  videoId: string;
}

export function VideoPlayer({ videoId }: Props) {
  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
      {/* key={videoId} forces the iframe to remount on video change —
          without it, the old video can keep playing under the new page. */}
      <iframe
        key={videoId}
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
        title="Video player"
        className="h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
