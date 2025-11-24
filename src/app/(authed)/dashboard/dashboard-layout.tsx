"use client";

import type { PropsWithChildren } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/features/dashboard/components/app-sidebar";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <AppSidebar />
        <main>
          <DashboardHeader />
          <DashboardContent>{children}</DashboardContent>
        </main>
      </div>
    </SidebarProvider>
  );
}

const DashboardHeader = () => (
  <div className="w-full p-4">
    <SidebarTrigger />
  </div>
);

const DashboardContent = ({ children }: PropsWithChildren) => (
  <div className="w-full px-4">{children}</div>
);
