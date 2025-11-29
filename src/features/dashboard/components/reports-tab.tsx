"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useMonthlyRevenue, useUserHistory, useUserDiscount } from "@/hooks/use-reports";
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AdminReservation, UserReservationHistory } from "@/types";

const ReportsTab = () => {
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const { data: revenue, isLoading: revenueLoading } = useMonthlyRevenue(year, month);

  const { data: userHistory, isLoading: historyLoading } = useUserHistory(selectedUserId);
  const { data: userDiscount, isLoading: discountLoading } = useUserDiscount(selectedUserId);

  const { data: reservations } = useQuery({
    queryKey: QUERY_KEYS.adminReservations,
    queryFn: async () => {
      const res = await betterFetch("@get/Reservation/admin/all");
      if (res.error) throw res.error;
      return res.data;
    },
  });

  const uniqueUserIds = reservations
    ? Array.from(new Set(reservations.map((r: AdminReservation) => r.userId)))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Monthly Revenue Report</CardTitle>
          <CardDescription>View revenue statistics for a specific month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="year" className="mb-1">Year</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                min={2020}
                max={2100}
              />
            </div>
            <div>
              <Label htmlFor="month" className="mb-1">Month</Label>
              <Input
                id="month"
                type="number"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                min={1}
                max={12}
              />
            </div>
          </div>
          {revenueLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : revenue ? (
            <div className="space-y-2">
              <p><strong>Total Reservations:</strong> {revenue.totalReservations}</p>
              <p><strong>Total Revenue:</strong> ${revenue.totalRevenue.toFixed(2)}</p>
              <p><strong>Average Reservation Value:</strong> ${revenue.averageReservationValue.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No data available for this period</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>User Reservation History</CardTitle>
          <CardDescription>View reservation history for a specific user</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userId" className="mb-1">User ID</Label>
            <Input
              id="userId"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
          {selectedUserId && (
            <>
              {historyLoading ? (
                <p className="text-muted-foreground">Loading...</p>
              ) : userHistory && userHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Car</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Total Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {userHistory.map((history: UserReservationHistory) => (
                      <TableRow key={history.id}>
                        <TableCell>{history.brand} {history.model}</TableCell>
                        <TableCell>{new Date(history.startDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(history.endDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>${history.totalPrice.toFixed(2)}</TableCell>
                        <TableCell>{history.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground">No reservations found for this user</p>
              )}
              {selectedUserId && (
                <div className="mt-4">
                  {discountLoading ? (
                    <p className="text-muted-foreground">Loading discount...</p>
                  ) : userDiscount ? (
                    <p><strong>User Discount:</strong> {userDiscount.discountPercentage}%</p>
                  ) : null}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Quick User Lookup</CardTitle>
          <CardDescription>Select a user from recent reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {uniqueUserIds.slice(0, 10).map((userId: string) => (
              <Button
                key={userId}
                variant="outline"
                size="sm"
                onClick={() => setSelectedUserId(userId)}
              >
                {userId.substring(0, 8)}...
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsTab;

