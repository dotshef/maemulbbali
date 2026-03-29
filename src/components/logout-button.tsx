"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors rounded-md px-3 py-2 cursor-pointer"
    >
      로그아웃
    </button>
  );
}
