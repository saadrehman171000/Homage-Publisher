"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SsoCallback() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/not-authorized");
  }, [router]);
  return null;
} 