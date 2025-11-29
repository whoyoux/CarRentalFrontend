"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUserHistory } from "@/hooks/use-reports";
import useUser from "@/hooks/use-user";
import type { UserReservationHistory } from "@/types";
import { i18n } from "@/lib/i18n";

const AccountHistory = () => {
  const { user } = useUser();
  const userId = user?.data?.id;
  const { data: history, isLoading } = useUserHistory(userId || "");

  if (!userId) {
    return <div className="text-muted-foreground">{i18n.dashboard.accountHistory.loginRequired}</div>;
  }

  if (isLoading) {
    return <div className="text-muted-foreground">{i18n.dashboard.accountHistory.loading}</div>;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{i18n.dashboard.accountHistory.title}</CardTitle>
        <CardDescription>{i18n.dashboard.accountHistory.description}</CardDescription>
      </CardHeader>
      <CardContent>
        {history && history.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{i18n.dashboard.accountHistory.car}</TableHead>
                <TableHead>{i18n.dashboard.accountHistory.startDate}</TableHead>
                <TableHead>{i18n.dashboard.accountHistory.endDate}</TableHead>
                <TableHead>{i18n.dashboard.accountHistory.totalPrice}</TableHead>
                <TableHead>{i18n.dashboard.accountHistory.status}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item: UserReservationHistory) => (
                <TableRow key={item.id}>
                  <TableCell>{item.brand} {item.model}</TableCell>
                  <TableCell>{new Date(item.startDateTime).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(item.endDateTime).toLocaleDateString()}</TableCell>
                  <TableCell>${item.totalPrice.toFixed(2)}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.status === "Completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                      item.status === "Active" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                    }`}>
                      {item.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-muted-foreground text-center py-4">{i18n.dashboard.accountHistory.noHistory}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountHistory;
