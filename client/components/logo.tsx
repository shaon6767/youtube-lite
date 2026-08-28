import { Play } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600">
        <Play className="h-4 w-4 fill-white text-white" />
      </span>
      <span className="text-lg font-bold tracking-tight">
        <span className="text-foreground">Play</span>
        <span className="text-red-600">Lite</span>
      </span>
    </Link>
  );
}
