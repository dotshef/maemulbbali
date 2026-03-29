"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 1. 인증코드 발송
  const handleSendCode = async () => {
    setError("");
    if (!email) {
      setError("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/send-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setCodeSent(true);
    setLoading(false);
  };

  // 2. 인증코드 확인
  const handleVerifyCode = async () => {
    setError("");
    if (!verificationCode) {
      setError("인증코드를 입력해주세요.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: verificationCode }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error);
      setLoading(false);
      return;
    }

    setEmailVerified(true);
    setCodeSent(false);
    setLoading(false);
  };

  // 3. 회원가입
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!companyName.trim()) {
      setError("업체명을 입력해주세요.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, company_name: companyName.trim() }),
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
        <h1 className="text-2xl font-bold text-center text-primary">회원가입</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          {/* 이메일 */}
          <div>
            <Label className="text-base mb-1 block">이메일</Label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="!text-base min-h-10 py-2"
                disabled={codeSent || emailVerified}
                required
              />
              {!emailVerified ? (
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={loading}
                  className="shrink-0 text-base min-h-10 cursor-pointer"
                >
                  {loading && !codeSent ? "발송 중..." : codeSent ? "재발송" : "인증하기"}
                </Button>
              ) : (
                <span className="shrink-0 flex items-center text-base font-medium text-green-600 px-3">
                  인증완료
                </span>
              )}
            </div>
          </div>

          {/* 인증코드 입력 */}
          {codeSent && !emailVerified && (
            <div>
              <Label className="text-base mb-1 block">인증코드</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="6자리 코드 입력"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className="!text-base min-h-10 py-2"
                />
                <Button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={loading}
                  className="shrink-0 text-base min-h-10 cursor-pointer"
                >
                  {loading ? "확인 중..." : "확인"}
                </Button>
              </div>
            </div>
          )}

          {/* 비밀번호 (인증 완료 후) */}
          {emailVerified && (
            <>
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
              <div>
                <Label className="text-base mb-1 block">비밀번호 확인</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="!text-base min-h-10 py-2"
                  required
                />
              </div>
              <div>
                <Label className="text-base mb-1 block">업체명</Label>
                <Input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="업체명을 입력해주세요"
                  className="!text-base min-h-10 py-2"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full text-base min-h-10 cursor-pointer"
              >
                {loading ? "가입 중..." : "회원가입"}
              </Button>
            </>
          )}

          {error && <p className="text-base text-destructive">{error}</p>}
        </form>
        <p className="text-base text-center text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
