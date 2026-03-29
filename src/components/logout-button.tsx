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
      className="text-lg font-semibold hover:text-red-500 transition-colors rounded-md border border-border px-4 py-2 cursor-pointer"
    >
      로그아웃
    </button>
  );
}
