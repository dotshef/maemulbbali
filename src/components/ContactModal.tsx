"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ContactModal() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  useEffect(() => {
    if (!open) return;
    fetch("/api/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user?.email) {
          setEmail(data.user.email);
        }
      })
      .catch(() => {});
  }, [open]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error || "전송에 실패했습니다.");
        return;
      }

      setStatus("success");
      setTimeout(() => {
        setOpen(false);
        setName("");
        setEmail("");
        setMessage("");
        setStatus("idle");
      }, 1500);
    } catch {
      setStatus("error");
      setErrorMsg("네트워크 오류가 발생했습니다.");
    }
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="text-base font-semibold px-6 py-2 h-auto cursor-pointer"
      >
        문의하기
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        >
          <div className="w-full max-w-lg mx-4 rounded-xl bg-card p-8 ring-1 ring-foreground/10 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-foreground">문의하기</h2>
              <button
                onClick={() => {
                  setOpen(false);
                  setStatus("idle");
                  setErrorMsg("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors text-xl leading-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="mb-4 text-base text-muted-foreground">
              불편한 사항이나 건의하고 싶은 내용을 자유롭게 작성해주세요
            </p>

            {status === "success" ? (
              <p className="text-center py-8 text-foreground font-medium">
                문의가 접수되었습니다.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="이름"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일"
                  required
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="문의 내용을 입력해주세요"
                  rows={6}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />

                {status === "error" && (
                  <p className="mt-2 text-base text-destructive">{errorMsg}</p>
                )}

                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full mt-4 h-10 text-base font-semibold cursor-pointer"
                >
                  {status === "loading" ? "전송 중..." : "제출하기"}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
