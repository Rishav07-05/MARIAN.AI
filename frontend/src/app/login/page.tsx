'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/sign-in');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-[#F5F5F0] flex items-center justify-center font-sans">
      <div className="text-sm text-gray-400">Redirecting to MARIAN.AI Authentication...</div>
    </div>
  );
}
