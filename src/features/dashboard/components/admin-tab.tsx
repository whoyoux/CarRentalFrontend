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
import { i18n } from "@/lib/i18n";

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

  const usersMap = new Map<string, { email: string; rentalCount: number; totalAmount: number }>();

  if (reservations) {
    reservations.forEach((r) => {
      const existing = usersMap.get(r.userId) || { email: r.userEmail, rentalCount: 0, totalAmount: 0 };
      usersMap.set(r.userId, {
        email: r.userEmail,
        rentalCount: existing.rentalCount + 1,
        totalAmount: existing.totalAmount + r.totalPrice,
      });
    });
  }

  const uniqueUserIds = reservations
    ? Array.from(new Set(reservations.map((r) => r.userId)))
    : [];

  const handleCancelReservation = async (id: number) => {
    if (confirm(i18n.dashboard.admin.allReservations.cancelConfirm)) {
      await adminCancelReservation.mutateAsync(id);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.admin.monthlyRevenue.title}</CardTitle>
          <CardDescription>{i18n.dashboard.admin.monthlyRevenue.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div>
              <Label htmlFor="year" className="mb-1">{i18n.dashboard.admin.monthlyRevenue.year}</Label>
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
              <Label htmlFor="month" className="mb-1">{i18n.dashboard.admin.monthlyRevenue.month}</Label>
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
            <p className="text-muted-foreground">{i18n.dashboard.admin.monthlyRevenue.loading}</p>
          ) : revenueError ? (
            <p className="text-destructive">
              {i18n.dashboard.admin.monthlyRevenue.error} {revenueError instanceof Error ? revenueError.message : i18n.dashboard.admin.monthlyRevenue.failedToFetch}
            </p>
          ) : revenue ? (
            <div className="space-y-2">
              <p><strong>{i18n.dashboard.admin.monthlyRevenue.totalReservations}</strong> {revenue.totalReservations}</p>
              <p><strong>{i18n.dashboard.admin.monthlyRevenue.totalRevenue}</strong> ${revenue.totalRevenue.toFixed(2)}</p>
              <p><strong>{i18n.dashboard.admin.monthlyRevenue.averageReservationValue}</strong> ${revenue.averageReservationValue.toFixed(2)}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">{i18n.dashboard.admin.monthlyRevenue.noData}</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.admin.userHistory.title}</CardTitle>
          <CardDescription>{i18n.dashboard.admin.userHistory.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userId" className="mb-1">{i18n.dashboard.admin.userHistory.userId}</Label>
            <Input
              id="userId"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              placeholder={i18n.dashboard.admin.userHistory.userIdPlaceholder}
            />
            {selectedUserId && usersMap.has(selectedUserId) && (
              <p className="text-sm text-muted-foreground mt-1">
                Email: {usersMap.get(selectedUserId)?.email}
              </p>
            )}
          </div>
          {selectedUserId && (
            <>
              {historyLoading ? (
                <p className="text-muted-foreground">{i18n.dashboard.admin.userHistory.loading}</p>
              ) : historyError ? (
                <p className="text-destructive">
                  {i18n.dashboard.admin.userHistory.error} {historyError instanceof Error ? historyError.message : i18n.dashboard.admin.userHistory.failedToFetch}
                </p>
              ) : userHistory && userHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{i18n.dashboard.admin.userHistory.car}</TableHead>
                      <TableHead>{i18n.dashboard.admin.userHistory.startDate}</TableHead>
                      <TableHead>{i18n.dashboard.admin.userHistory.endDate}</TableHead>
                      <TableHead>{i18n.dashboard.admin.userHistory.totalPrice}</TableHead>
                      <TableHead>{i18n.dashboard.admin.userHistory.status}</TableHead>
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
                <p className="text-muted-foreground">{i18n.dashboard.admin.userHistory.noReservations}</p>
              )}
              {selectedUserId && (
                <div className="mt-4">
                  {discountLoading ? (
                    <p className="text-muted-foreground">{i18n.dashboard.admin.userHistory.loadingDiscount}</p>
                  ) : discountError ? (
                    <p className="text-destructive">
                      {i18n.dashboard.admin.userHistory.discountError} {discountError instanceof Error ? discountError.message : i18n.dashboard.admin.userHistory.failedToFetchDiscount}
                    </p>
                  ) : userDiscount ? (
                    <p><strong>{i18n.dashboard.admin.userHistory.userDiscount}</strong> {userDiscount.discountPercentage}%</p>
                  ) : null}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.admin.quickLookup.title}</CardTitle>
          <CardDescription>{i18n.dashboard.admin.quickLookup.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {uniqueUserIds.slice(0, 10).map((userId: string) => {
              const userData = usersMap.get(userId);
              return (
                <Button
                  key={userId}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedUserId(userId)}
                >
                  {userData?.email || userId.substring(0, 8) + "..."}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.admin.allReservations.title}</CardTitle>
          <CardDescription>{i18n.dashboard.admin.allReservations.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <p className="text-muted-foreground">{i18n.dashboard.admin.allReservations.loading}</p>
          ) : reservations && reservations.length > 0 ? (
            <Table>
              <TableCaption>{i18n.dashboard.admin.allReservations.caption}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{i18n.dashboard.admin.allReservations.id}</TableHead>
                  <TableHead>{i18n.dashboard.admin.allReservations.userEmail}</TableHead>
                  <TableHead>{i18n.dashboard.admin.allReservations.car}</TableHead>
                  <TableHead>{i18n.dashboard.admin.allReservations.startDate}</TableHead>
                  <TableHead>{i18n.dashboard.admin.allReservations.endDate}</TableHead>
                  <TableHead>{i18n.dashboard.admin.allReservations.totalPrice}</TableHead>
                  <TableHead className="text-right">{i18n.dashboard.admin.allReservations.actions}</TableHead>
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
                              {i18n.dashboard.admin.allReservations.cancel}
                            </Button>
                          ) : (
                            <span className="text-muted-foreground text-sm">{i18n.dashboard.admin.allReservations.pastReservation}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <p className="text-muted-foreground">{i18n.dashboard.admin.allReservations.noReservations}</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.admin.usersList.title}</CardTitle>
          <CardDescription>{i18n.dashboard.admin.usersList.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {reservationsLoading ? (
            <p className="text-muted-foreground">{i18n.dashboard.admin.usersList.loading}</p>
          ) : usersMap.size > 0 ? (
            <Table>
              <TableCaption>{i18n.dashboard.admin.usersList.caption}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{i18n.dashboard.admin.usersList.icon}</TableHead>
                  <TableHead>{i18n.dashboard.admin.usersList.email}</TableHead>
                  <TableHead>{i18n.dashboard.admin.usersList.rentalCount}</TableHead>
                  <TableHead className="text-right">{i18n.dashboard.admin.usersList.totalAmount}</TableHead>
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
            <p className="text-muted-foreground">{i18n.dashboard.admin.usersList.noUsers}</p>
          )}
        </CardContent>
      </Card>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.admin.reservationLogs.title}</CardTitle>
          <CardDescription>{i18n.dashboard.admin.reservationLogs.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <p className="text-muted-foreground">{i18n.dashboard.admin.reservationLogs.loading}</p>
          ) : logsError ? (
            <p className="text-destructive">
              {i18n.dashboard.admin.reservationLogs.error} {logsError instanceof Error ? logsError.message : i18n.dashboard.admin.reservationLogs.failedToFetch}
            </p>
          ) : reservationLogs && reservationLogs.length > 0 ? (
            <Table>
              <TableCaption>{i18n.dashboard.admin.reservationLogs.caption}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{i18n.dashboard.admin.reservationLogs.id}</TableHead>
                  <TableHead>{i18n.dashboard.admin.reservationLogs.reservationId}</TableHead>
                  <TableHead>{i18n.dashboard.admin.reservationLogs.userId}</TableHead>
                  <TableHead>{i18n.dashboard.admin.reservationLogs.action}</TableHead>
                  <TableHead>{i18n.dashboard.admin.reservationLogs.date}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservationLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.id}</TableCell>
                    <TableCell>{log.reservationId}</TableCell>
                    <TableCell className="font-mono text-xs">{log.userId.substring(0, 8)}...</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${log.action === i18n.dashboard.admin.reservationLogs.actions.created ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                        log.action === i18n.dashboard.admin.reservationLogs.actions.cancelled ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
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
            <p className="text-muted-foreground">{i18n.dashboard.admin.reservationLogs.noLogs}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTab;
