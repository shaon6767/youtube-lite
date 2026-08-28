"use client";

import { api } from "@/lib/api";
import { useEffect, useState } from "react";

interface Comment {
  _id: string;
  text: string;
  rating: number;
  user: { name: string };
  createdAt: string;
}

export function CommentSection({ videoId }: { videoId: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.get(`/comments/${videoId}`).then((res) => setComments(res.data));
  }, [videoId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await api.post("/comments", { videoId, text, rating });
      setComments((prev) => [res.data, ...prev]);
      setText("");
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mt-6">
      <h2 className="mb-3 font-semibold">{comments.length} Comments</h2>

      <form onSubmit={submit} className="mb-6 flex flex-col gap-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          className="rounded border p-2"
          rows={2}
        />
        <div className="flex items-center gap-2">
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="rounded border p-1"
          >
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <button
            disabled={submitting}
            className="rounded bg-black px-4 py-1 text-white disabled:opacity-50"
          >
            Post
          </button>
        </div>
      </form>

      <ul className="space-y-4">
        {comments.map((c) => (
          <li key={c._id}>
            <p className="text-sm font-medium">
              {c.user.name} · {"★".repeat(c.rating)}
            </p>
            <p className="text-sm text-gray-700">{c.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
