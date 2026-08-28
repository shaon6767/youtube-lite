import Link from "next/link";

interface Props {
  videoId: string;
  title: string;
  thumbnail: string;
  channelTitle?: string;
}

export function VideoCard({ videoId, title, thumbnail, channelTitle }: Props) {
  return (
    <Link href={`/watch/${videoId}`} className="block group">
      <div className="aspect-video overflow-hidden rounded-lg bg-gray-100">
        <img
          src={thumbnail}
          alt={title}
          className="h-full w-full object-cover transition group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <h3 className="mt-2 line-clamp-2 text-sm font-medium">{title}</h3>
      {channelTitle && <p className="text-xs text-gray-500">{channelTitle}</p>}
    </Link>
  );
}
