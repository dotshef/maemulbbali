export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="max-w-2xl mx-auto px-4 py-6 text-sm text-muted-foreground space-y-1">
        <p className="font-semibold text-foreground">닷셰프</p>
        <p>대표: 박시준</p>
        <p>사업자등록번호: 251-12-03141</p>
        <p>
          이메일:{" "}
          <a href="mailto:contact@dotshef.com" className="underline hover:text-foreground">
            contact@dotshef.com
          </a>
        </p>
        <p>주소: 서울특별시 영등포구 영등포로 150, 지하1층 가라지 204호</p>
      </div>
    </footer>
  );
}
