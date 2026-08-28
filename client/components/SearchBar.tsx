"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SearchBar() {
  const [value, setValue] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search videos"
        className="flex-1 rounded-l-full border px-4 py-2 outline-none"
      />
      <button
        type="submit"
        className="rounded-r-full border border-l-0 px-4 py-2"
      >
        Search
      </button>
    </form>
  );
}
