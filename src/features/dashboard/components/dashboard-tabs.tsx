import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from "./account-settings";
import AdminTab from "./admin-tab";
import UserRentals from "./user-rentals";
import CarsManagementTab from "./cars-management-tab";

const TAB_KEYS = {
  MY_RENTALS: "MY_RENTALS",
  ACCOUNT_SETTINGS: "ACCOUNT_SETTINGS",
  ADMIN: "ADMIN",
  CARS: "CARS",
} as const;

type DashboardTabsProps = {
  isAdmin: boolean;
};

const DashboardTabs = ({ isAdmin }: DashboardTabsProps) => (
  <Tabs className="w-full" defaultValue={TAB_KEYS.MY_RENTALS}>
    <TabsList className="w-full">
      <TabsTrigger value={TAB_KEYS.MY_RENTALS}>My rentals</TabsTrigger>
      <TabsTrigger value={TAB_KEYS.ACCOUNT_SETTINGS}>Settings</TabsTrigger>
      {isAdmin ? (
        <>
          <TabsTrigger className="" value={TAB_KEYS.ADMIN}>
            <span className="text-destructive">Admin</span>
          </TabsTrigger>
          <TabsTrigger className="" value={TAB_KEYS.CARS}>
            <span className="text-destructive">Cars</span>
          </TabsTrigger>
        </>
      ) : null}
    </TabsList>
    <TabsContent value={TAB_KEYS.MY_RENTALS}>
      <UserRentals />
    </TabsContent>
    <TabsContent value={TAB_KEYS.ACCOUNT_SETTINGS}>
      <AccountSettings />
    </TabsContent>
    {isAdmin ? (
      <>
        <TabsContent value={TAB_KEYS.ADMIN}>
          <AdminTab />
        </TabsContent>
        <TabsContent value={TAB_KEYS.CARS}>
          <CarsManagementTab />
        </TabsContent>
      </>
    ) : null}
  </Tabs>
);

export default DashboardTabs;
