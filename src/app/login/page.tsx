"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <main className="flex flex-1 items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border bg-card p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-primary">매물빨리</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label className="text-base mb-1 block">이메일</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="!text-base min-h-10 py-2"
              required
            />
          </div>
          <div>
            <Label className="text-base mb-1 block">비밀번호</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="!text-base min-h-10 py-2"
              required
            />
          </div>
          {error && <p className="text-base text-destructive">{error}</p>}
          <Button
            type="submit"
            disabled={loading}
            className="w-full text-base min-h-10 cursor-pointer"
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>
        </form>
        <p className="text-sm text-center text-muted-foreground">
          계정이 없으신가요?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
