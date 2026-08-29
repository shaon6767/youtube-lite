"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Heart, History as HistoryIcon, LogOut, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [favoritesCount, setFavoritesCount] = useState<number | null>(null);
  const [historyCount, setHistoryCount] = useState<number | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    api
      .get("/favorites")
      .then((res) => setFavoritesCount(res.data.length))
      .catch(() => setFavoritesCount(0));
    api
      .get("/history")
      .then((res) => setHistoryCount(res.data.length))
      .catch(() => setHistoryCount(0));
  }, [user, authLoading, router]);

  if (authLoading || !user) {
    return (
      <div className="mx-auto max-w-md">
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  const joined = new Date(user.createdAt).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader className="items-center text-center">
          <Avatar className="size-20">
            <AvatarFallback className="bg-red-600 text-2xl text-white">
              {user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-3 text-xl font-semibold">{user.name}</h1>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            <Mail className="size-3.5" />
            {user.email}
          </p>
          <p className="text-xs text-muted-foreground">Member since {joined}</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col items-center gap-1 rounded-lg border p-4">
              <Heart className="size-5 text-red-600" />
              <span className="text-lg font-semibold">
                {favoritesCount ?? "—"}
              </span>
              <span className="text-xs text-muted-foreground">Favorites</span>
            </div>
            <div className="flex flex-col items-center gap-1 rounded-lg border p-4">
              <HistoryIcon className="size-5 text-red-600" />
              <span className="text-lg font-semibold">
                {historyCount ?? "—"}
              </span>
              <span className="text-xs text-muted-foreground">Watched</span>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => logout()}
          >
            <LogOut className="mr-2 size-4" />
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
