import DashboardLayout from "./dashboard/dashboard-layout";

type Props = {
  children: React.ReactNode;
};

export default function AuthedLayout({ children }: Props) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
