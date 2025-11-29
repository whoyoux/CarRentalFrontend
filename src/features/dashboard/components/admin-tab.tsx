"use client";

import { useState } from "react";
import { CircleUserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMonthlyRevenue, useUserHistory, useUserDiscount } from "@/hooks/use-reports";
import { useReservationLogs } from "@/hooks/use-reservation-logs";
import { useQuery } from "@tanstack/react-query";
import { betterFetch } from "@/lib/better-fetch";
import { QUERY_KEYS } from "@/lib/query-keys";
import useAdminCancelReservation from "@/hooks/use-admin-cancel-reservation";
import type { AdminReservation, UserReservationHistory } from "@/types";

const AdminTab = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const currentDate = new Date();
  const [year, setYear] = useState(currentDate.getFullYear());
  const [month, setMonth] = useState(currentDate.getMonth() + 1);

  const { data: revenue, isLoading: revenueLoading, error: revenueError } = useMonthlyRevenue(year, month);
  const { data: userHistory, isLoading: historyLoading, error: historyError } = useUserHistory(selectedUserId);
  const { data: userDiscount, isLoading: discountLoading, error: discountError } = useUserDiscount(selectedUserId);
  const { data: reservationLogs, isLoading: logsLoading, error: logsError } = useReservationLogs();
  const adminCancelReservation = useAdminCancelReservation();

  const { data: reservations, isLoading: reservationsLoading } = useQuery({
    queryKey: QUERY_KEYS.adminReservations,
    queryFn: async () => {
      const res = await betterFetch("@get/Reservation/admin/all");
      if (res.error) throw res.error;
      return res.data;
    },
  });

  // Extract unique users from reservations
  const usersMap = new Map<string, { email: string; rentalCount: number; totalAmount: number }>();

  if (reservations) {
    reservations.forEach((r: AdminReservation) => {
      const existing = usersMap.get(r.userId) || { email: r.userEmail, rentalCount: 0, totalAmount: 0 };
      usersMap.set(r.userId, {
        email: r.userEmail,
        rentalCount: existing.rentalCount + 1,
        totalAmount: existing.totalAmount + r.totalPrice,
      });
    });
  }

  const uniqueUserIds = reservations
    ? Array.from(new Set(reservations.map((r: AdminReservation) => r.userId)))
    : [];

  const handleCancelReservation = async (id: number) => {
    if (confirm("Are you sure you want to cancel this reservation?")) {
      await adminCancelReservation.mutateAsync(id);
    }
  };

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
          ) : revenueError ? (
            <p className="text-destructive">
              Error: {revenueError instanceof Error ? revenueError.message : "Failed to fetch monthly revenue"}
            </p>
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
              ) : historyError ? (
                <p className="text-destructive">
                  Error: {historyError instanceof Error ? historyError.message : "Failed to fetch user history"}
                </p>
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
                  ) : discountError ? (
                    <p className="text-destructive">
                      Error: {discountError instanceof Error ? discountError.message : "Failed to fetch discount"}
                    </p>
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

      <Card className="w-full">
        <CardHeader>
          <CardTitle>All Reservations</CardTitle>
          <CardDescription>Manage all reservations in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : reservations && reservations.length > 0 ? (
            <Table>
              <TableCaption>A list of all reservations.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Total Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...reservations]
                  .sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    return dateB - dateA; // Sort descending (newest first)
                  })
                  .map((reservation) => {
                    const endDate = new Date(reservation.endDateTime);
                    const now = new Date();
                    // Can only cancel if end date is in the future
                    const canCancel = endDate > now;
                    
                    return (
                      <TableRow key={reservation.id}>
                        <TableCell>{reservation.id}</TableCell>
                        <TableCell>{reservation.userEmail}</TableCell>
                        <TableCell>{reservation.carBrand} {reservation.carModel}</TableCell>
                        <TableCell>{new Date(reservation.startDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(reservation.endDateTime).toLocaleDateString()}</TableCell>
                        <TableCell>${reservation.totalPrice.toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          {canCancel ? (
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleCancelReservation(reservation.id)}
                              disabled={adminCancelReservation.isPending}
                            >
                              Cancel
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">Past reservation</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No reservations found</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Users List</CardTitle>
          <CardDescription>List of all users with rental statistics</CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : usersMap.size > 0 ? (
            <Table>
              <TableCaption>A list of users.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Count of rentals</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from(usersMap.entries()).map(([userId, userData]) => (
                  <TableRow key={userId}>
                    <TableCell>
                      <CircleUserRound />
                    </TableCell>
                    <TableCell>{userData.email}</TableCell>
                    <TableCell>{userData.rentalCount}</TableCell>
                    <TableCell className="text-right">${userData.totalAmount.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No users found</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Reservation Logs</CardTitle>
          <CardDescription>View all reservation activity logs for all users in the system</CardDescription>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <p className="text-muted-foreground">Loading logs...</p>
          ) : logsError ? (
            <p className="text-destructive">
              Error: {logsError instanceof Error ? logsError.message : "Failed to fetch reservation logs"}
            </p>
          ) : reservationLogs && reservationLogs.length > 0 ? (
            <Table>
              <TableCaption>A list of all reservation activity logs.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Reservation ID</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservationLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.reservationId}</TableCell>
                    <TableCell className="font-mono text-xs">{log.userId.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        log.action === "Created" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        log.action === "Cancelled" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                      }`}>
                        {log.action}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(log.logDate).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">No reservation logs found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTab;
