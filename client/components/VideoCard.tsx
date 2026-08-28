import Link from "next/link";

interface Props {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle?: string;
}

export function VideoCard({ videoId, title, thumbnail, channelTitle }: Props) {
  return (
    <Link href={`/watch/${videoId}`} className="group block">
      <div className="aspect-video overflow-hidden rounded-lg bg-muted">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium">{title}</h3>
      {channelTitle && (
        <p className="text-xs text-muted-foreground">{channelTitle}</p>
      )}
    </Link>
  );
}
