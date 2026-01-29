// app/login/page.tsx
import { Suspense } from 'react';
import SignIn from './components/login';


export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">載入中...</div>}>
      <SignIn />
    </Suspense>
  );
}