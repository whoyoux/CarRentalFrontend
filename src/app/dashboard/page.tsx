"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/auth-store";

const TAB_KEYS = {
  MY_RENTALS: "MY_RENTALS",
  ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS",
  ACCOUNT_HISTORY: "ACCOUNT_HISTORY",
} as const;

// const TAB_OPTIONS = {
//   "MY_RENTALS": <div />,
//   "ACCOUNT_SETTINGS": <div />
// } as const;

const DashboardPage = () => {
  const router = useRouter();
  const isAuthed = useAuthStore((state) => state.accessToken);

  useEffect(() => {
    if (!isAuthed) {
      router.push("/login");
    }
  }, [isAuthed, router]);

  if (isAuthed) {
    return (
      <Tabs className="w-full" defaultValue={TAB_KEYS.MY_RENTALS}>
        <TabsList className="w-full">
          <TabsTrigger value={TAB_KEYS.MY_RENTALS}>My rentals</TabsTrigger>
          <TabsTrigger value={TAB_KEYS.ACCOUNT_HISTORY}>History</TabsTrigger>
          <TabsTrigger value={TAB_KEYS.ACCOUNT_SETTINGS}>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value={TAB_KEYS.MY_RENTALS}>rentals here</TabsContent>
        <TabsContent value={TAB_KEYS.ACCOUNT_HISTORY}>
          account history
        </TabsContent>
        <TabsContent value={TAB_KEYS.ACCOUNT_SETTINGS}>
          account settings
        </TabsContent>
      </Tabs>
    );
  }

  return <Skeleton className="min-h-[50vh] w-full" />;
};

export default DashboardPage;
