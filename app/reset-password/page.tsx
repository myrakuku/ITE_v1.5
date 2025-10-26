// app/reset-password/page.tsx
import ResetPasswordPage from "@/components/ResetPasswordPage";
import { Suspense } from "react";


export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="text-[#e7915b] text-lg">正在載入...</div>}>
      <ResetPasswordPage />
    </Suspense>
  );
}
