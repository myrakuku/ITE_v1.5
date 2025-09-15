"use client";

import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Certificate {
  id: string;
  name: string;
  date: string;
}

export default function CertificateListPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const userId = params.userId as string;
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id !== userId) {
      router.push("/login");
    } else if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, session, userId, router]);

  useEffect(() => {
    async function fetchCertificates() {
      const response = await fetch(`/api/user/${userId}/certificates`);
      const data = await response.json();
      setCertificates(data);
    }
    if (status === "authenticated") {
      fetchCertificates();
    }
  }, [status, userId]);

  if (status === "loading") {
    return <div>載入中...</div>;
  }

  if (!session || session.user.role !== "USER") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">我的證書</h1>
        <div className="grid gap-4">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="p-4 bg-white rounded-lg shadow">
              <h2 className="text-xl font-semibold">{certificate.name}</h2>
              <p>發證日期: {certificate.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}