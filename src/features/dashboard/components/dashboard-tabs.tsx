import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AccountSettings from "./account-settings";
import AdminTab from "./admin-tab";
import UserRentals from "./user-rentals";
import CarsManagementTab from "./cars-management-tab";
import { i18n } from "@/lib/i18n";

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
      <TabsTrigger value={TAB_KEYS.MY_RENTALS}>{i18n.dashboard.tabs.myRentals}</TabsTrigger>
      <TabsTrigger value={TAB_KEYS.ACCOUNT_SETTINGS}>{i18n.dashboard.tabs.settings}</TabsTrigger>
      {isAdmin ? (
        <>
          <TabsTrigger className="" value={TAB_KEYS.ADMIN}>
            <span className="text-destructive">{i18n.dashboard.tabs.admin}</span>
          </TabsTrigger>
          <TabsTrigger className="" value={TAB_KEYS.CARS}>
            <span className="text-destructive">{i18n.dashboard.tabs.cars}</span>
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
