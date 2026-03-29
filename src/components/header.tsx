import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import { LogoutButton } from "./logout-button";
import { HeaderNav } from "./header-nav";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="border-b bg-card">
      {/* 상단: 로고 + 로그아웃 */}
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold text-primary">
          매물빨리
        </Link>
        {user && <LogoutButton />}
      </div>
      {/* 하단: 네비게이션 탭 (로그인 사용자만, 공간은 유지) */}
      {user ? <HeaderNav /> : null }
    </header>
  );
}
