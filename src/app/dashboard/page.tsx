"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUser from "@/hooks/use-user";

const TAB_KEYS = {
  MY_RENTALS: "MY_RENTALS",
  ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS",
  ACCOUNT_HISTORY: "ACCOUNT_HISTORY",
  ADMIN: "ADMIN",
} as const;

const DashboardPage = () => {
  const router = useRouter();
  const { user, success, isAdmin } = useUser();

  useEffect(() => {
    if (!success) {
      router.push("/login");
    }
  }, [success, router]);

  if (user) {
    return (
      <Tabs className="w-full" defaultValue={TAB_KEYS.MY_RENTALS}>
        <TabsList className="w-full">
          <TabsTrigger value={TAB_KEYS.MY_RENTALS}>My rentals</TabsTrigger>
          <TabsTrigger value={TAB_KEYS.ACCOUNT_HISTORY}>History</TabsTrigger>
          <TabsTrigger value={TAB_KEYS.ACCOUNT_SETTINGS}>Settings</TabsTrigger>
          {isAdmin ? (
            <TabsTrigger className="" value={TAB_KEYS.ADMIN}>
              <span className="text-destructive">Admin</span>
            </TabsTrigger>
          ) : null}
        </TabsList>
        <TabsContent value={TAB_KEYS.MY_RENTALS}>rentals here</TabsContent>
        <TabsContent value={TAB_KEYS.ACCOUNT_HISTORY}>
          account history
        </TabsContent>
        <TabsContent value={TAB_KEYS.ACCOUNT_SETTINGS}>
          account settings <br />
          {user.data?.email} <br />
          {user.data?.role} <br />
        </TabsContent>
        {isAdmin ? (
          <TabsContent value={TAB_KEYS.ADMIN}>ADMIN</TabsContent>
        ) : null}
      </Tabs>
    );
  }

  return <Skeleton className="min-h-[50vh] w-full" />;
};

export default DashboardPage;
