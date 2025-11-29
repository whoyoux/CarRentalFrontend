"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import useUser from "@/hooks/use-user";
import useUserReservations from "@/hooks/use-user-reservations";
import type { Reservation } from "@/types";
import { i18n } from "@/lib/i18n";

const AccountSettings = () => {
  const { user, isLoading: userLoading } = useUser();
  const { reservations, isLoading: reservationsLoading } = useUserReservations();

  const userEmail = user?.data?.email || i18n.dashboard.accountSettings.notAvailable;
  const totalReservations = reservations?.length || 0;
  const totalSpent = reservations?.reduce((sum: number, reservation: Reservation) => sum + (reservation.totalPrice || 0), 0) || 0;

  const isLoading = userLoading || reservationsLoading;

  return (
    <div className="flex flex-col gap-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{i18n.dashboard.accountSettings.title}</CardTitle>
          <CardDescription>{i18n.dashboard.accountSettings.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">{i18n.dashboard.accountSettings.loading}</p>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{i18n.dashboard.accountSettings.email}</p>
                <p className="text-lg">{userEmail}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{i18n.dashboard.accountSettings.totalReservations}</p>
                <p className="text-lg">{totalReservations}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{i18n.dashboard.accountSettings.totalSpent}</p>
                <p className="text-lg font-semibold">${totalSpent.toFixed(2)}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AccountSettings;
