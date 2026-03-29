"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "매물 면적 정보 조회", href: "/area" },
];

export function HeaderNav() {
  const pathname = usePathname();

  return (
    <nav className="max-w-2xl mx-auto px-4">
      <div className="flex gap-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-2 text-base font-medium rounded-t-sm -mb-px transition-colors ${
                isActive
                  ? "bg-[#f8f9fc] text-primary border border-b-0 border-primary/20"
                  : "text-muted-foreground hover:bg-[#f8f9fc]/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
