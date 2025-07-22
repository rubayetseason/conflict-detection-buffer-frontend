"use client";

import { JWT_TOKEN_PASS } from "@/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AuthClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem(JWT_TOKEN_PASS);
    if (token) {
      router.push("/dashboard/bookings");
    } else {
      router.push("/");
    }
  }, [router]);

  return <>{children}</>;
}
