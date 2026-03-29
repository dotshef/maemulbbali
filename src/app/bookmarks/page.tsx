"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import type { Bookmark } from "@/types/building";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadBookmarks = useCallback(async () => {
    try {
      const res = await fetch("/api/bookmarks");
      if (res.ok) {
        const { bookmarks } = await res.json();
        setBookmarks(bookmarks);
      }
    } catch (err) {
      console.error("[bookmarks] fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/bookmarks?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBookmarks((prev) => prev.filter((bm) => bm.id !== id));
      }
    } catch (err) {
      console.error("[bookmarks] delete error:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex flex-1 flex-col px-4 py-6">
        <div className="w-full max-w-2xl mx-auto">
          <p className="text-base text-muted-foreground">불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col px-4 py-6">
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <h1 className="text-xl font-semibold">북마크 관리</h1>

        {bookmarks.length === 0 ? (
          <p className="text-base text-muted-foreground">저장된 북마크가 없습니다.</p>
        ) : (
          <div className="rounded-lg border bg-card divide-y">
            {bookmarks.map((bm) => (
              <div key={bm.id} className="flex items-center justify-between px-4 py-3 gap-4">
                <div className="flex flex-col min-w-0">
                  <span className="text-base truncate">
                    {bm.jibunAddress}
                    {bm.buildingName ? ` (${bm.buildingName})` : ""}
                  </span>
                  <span className="text-base text-muted-foreground truncate">
                    {bm.roadAddress}
                  </span>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(bm.id)}
                  disabled={deletingId === bm.id}
                  className="shrink-0 text-base cursor-pointer"
                >
                  {deletingId === bm.id ? "삭제 중..." : "삭제"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
