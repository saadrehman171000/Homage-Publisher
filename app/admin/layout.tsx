"use client";

import { SignedIn, SignedOut, RedirectToSignIn, useUser } from "@clerk/nextjs";
import AdminSidebar from "@/components/layout/admin-sidebar";
import { useState, ReactNode, useEffect } from "react";
import { Menu } from "lucide-react";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = [
  "saadrehman1710000@gmail.com",
  "contact@homagepublishers.com",
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("[AdminLayout] isLoaded:", isLoaded, "user:", user, "email:", user?.primaryEmailAddress?.emailAddress);
    if (isLoaded && user && !ADMIN_EMAILS.includes(user.primaryEmailAddress?.emailAddress || "")) {
      router.push("/not-authorized");
    }
  }, [user, isLoaded, router]);

  return (
    <>
      <SignedIn>
        <div className="flex min-h-screen">
          <AdminSidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <div className="flex-1 bg-gray-50">
            {/* Mobile Top Bar */}
            <div className="md:hidden sticky top-0 z-40 bg-white border-b flex items-center h-16 px-4 shadow-sm">
              <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-md hover:bg-gray-100">
                <Menu className="h-6 w-6 text-red-600" />
              </button>
              <span className="ml-4 text-lg font-bold text-red-600">Admin Panel</span>
            </div>
            <main className="p-4 md:p-8">{children}</main>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
} 