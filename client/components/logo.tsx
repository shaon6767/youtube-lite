import { SquarePlay } from "lucide-react";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2">
      <span className="flex size-8 items-center justify-center rounded-full bg-red-600 text-sm font-bold text-white">
        <SquarePlay />
      </span>
      <span className="text-xl font-light tracking-wide">
        <span className="text-foreground">Stream</span>
        <span className="font-medium text-red-600">ly</span>
      </span>
    </Link>
  );
}
