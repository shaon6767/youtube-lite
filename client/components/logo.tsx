import { Play } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex h-7 w-10 items-center justify-center rounded-md bg-red-600">
        <Play className="size-4 fill-white text-white" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        <span className="text-foreground">Stream</span>
        <span className="text-red-600">ly</span>
      </span>
    </Link>
  );
}
