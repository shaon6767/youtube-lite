import { SearchBar } from "@/components/SearchBar";
import Link from "next/link";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <header className="flex items-center gap-6 border-b px-6 py-3">
          <Link href="/" className="font-bold">
            YT Lite
          </Link>
          <SearchBar />
          <Link href="/favorites" className="text-sm">
            Favorites
          </Link>
          <Link href="/history" className="text-sm">
            History
          </Link>
        </header>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
