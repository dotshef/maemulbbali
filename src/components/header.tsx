import { getSessionUser } from "@/lib/auth";
import ContactModal from "./ContactModal";
import { LogoutButton } from "./logout-button";

export async function Header() {
  const user = await getSessionUser();

  return (
    <header className="border-b bg-card">
      <div className="max-w-2xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="text-lg font-bold text-primary">매물 면적 정보 조회</span>
        <div className="flex items-center gap-2">
          <ContactModal />
          {user && <LogoutButton />}
        </div>
      </div>
    </header>
  );
}
