// components/GTMPageView.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { sendGTMEvent } from "@next/third-parties/google";

export default function GTMPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_GTM_ID) return;

    const url = pathname + (searchParams.toString() ? `?${searchParams}` : "");
    sendGTMEvent({
      event: "page_view",
      page_location: window.location.href,
      page_path: url,
    });
  }, [pathname, searchParams]);

  return null;
}