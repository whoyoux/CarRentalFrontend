"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardTabs from "@/features/dashboard/components/dashboard-tabs";
import useUser from "@/hooks/use-user";

const DashboardPage = () => {
  const router = useRouter();
  const { user, success, isAdmin } = useUser();

  useEffect(() => {
    if (!success) {
      router.push("/login");
    }
  }, [success, router]);

  if (user) {
    return <DashboardTabs isAdmin={isAdmin} />;
  }

  return <Skeleton className="min-h-[50vh] w-full" />;
};

export default DashboardPage;
