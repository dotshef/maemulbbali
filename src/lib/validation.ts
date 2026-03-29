export const signupValidation = {
  password(pwd: string): string | null {
    if (!pwd) return "비밀번호를 입력해주세요.";
    if (pwd.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    return null;
  },
  companyName(name: string): string | null {
    if (!name?.trim()) return "업체명을 입력해주세요.";
    return null;
  },
  email(email: string): string | null {
    if (!email) return "이메일을 입력해주세요.";
    return null;
  },
  confirmPassword(pwd: string, confirm: string): string | null {
    if (pwd !== confirm) return "비밀번호가 일치하지 않습니다.";
    return null;
  },
};
