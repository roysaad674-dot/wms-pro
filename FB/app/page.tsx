"use client";

import { useEffect } from "react";
import { Sidebar, MobileSidebarOverlay } from "@/components/sidebar/Sidebar";
import { Navbar } from "@/components/navbar/Navbar";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { LoginPage } from "@/components/pages/LoginPage";
import { useDashboardStore } from "@/store/dashboardStore";

export default function Home() {
  const { isAuthenticated, currentUser, initializeData } = useDashboardStore();

  useEffect(() => {
    // Restore session from localStorage on app load
    const savedUser = localStorage.getItem("currentUser");
    const savedAuth = localStorage.getItem("isAuthenticated");

    if (savedUser && savedAuth === "true") {
      const user = JSON.parse(savedUser);
      useDashboardStore.setState({ currentUser: user, isAuthenticated: true });
      // Load data when app initializes
      initializeData();
    }
  }, [initializeData]);

  // Persist authentication state to localStorage
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
      localStorage.setItem("isAuthenticated", "true");
    } else {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
    }
  }, [isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[280px] flex-shrink-0" style={{ borderRight: "1px solid var(--divider)" }}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      <MobileSidebarOverlay />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto">
          <DashboardContent />
        </main>
      </div>
    </div>
  );
}
