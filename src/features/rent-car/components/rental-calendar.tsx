"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { i18n } from "@/lib/i18n";

type RentalCalendarProps = {
  reservations: Array<{ startDateTime: string; endDateTime: string }>;
  pricePerDay: number;
  onRent: (startDate: Date, endDate: Date) => void;
  isLoading?: boolean;
};

const RentalCalendar = ({ reservations, pricePerDay, onRent, isLoading }: RentalCalendarProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();

  // Convert reservation strings to Date objects and create disabled date ranges
  const disabledDates = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (date: Date) => {
      // Disable past dates
      if (date < today) return true;

      // Disable dates that fall within any reservation period
      for (const reservation of reservations) {
        const start = new Date(reservation.startDateTime);
        const end = new Date(reservation.endDateTime);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        // Disable all dates in the reservation range (inclusive)
        if (date >= start && date <= end) {
          return true;
        }
      }

      return false;
    };
  }, [reservations]);

  // Check if a date range contains any blocked dates
  const hasBlockedDatesInRange = useMemo(() => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    for (const reservation of reservations) {
      const resStart = new Date(reservation.startDateTime);
      const resEnd = new Date(reservation.endDateTime);
      resStart.setHours(0, 0, 0, 0);
      resEnd.setHours(0, 0, 0, 0);

      // Check if reservation overlaps with selected range
      if (resStart <= end && resEnd >= start) {
        return true;
      }
    }

    return false;
  }, [startDate, endDate, reservations]);

  // Calculate available days (excluding blocked dates)
  const calculateAvailableDays = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    let availableDays = 0;
    const currentDate = new Date(start);

    while (currentDate <= end) {
      let isBlocked = false;

      // Check if current date is blocked by any reservation
      for (const reservation of reservations) {
        const resStart = new Date(reservation.startDateTime);
        const resEnd = new Date(reservation.endDateTime);
        resStart.setHours(0, 0, 0, 0);
        resEnd.setHours(0, 0, 0, 0);

        if (currentDate >= resStart && currentDate <= resEnd) {
          isBlocked = true;
          break;
        }
      }

      if (!isBlocked) {
        availableDays++;
      }

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return availableDays;
  }, [startDate, endDate, reservations]);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate) return 0;
    // Use available days instead of total days
    return calculateAvailableDays * pricePerDay;
  };

  const handleRent = () => {
    if (startDate && endDate && !hasBlockedDatesInRange && calculateAvailableDays > 0) {
      onRent(startDate, endDate);
    }
  };

  const canRent = startDate && endDate && startDate <= endDate && !hasBlockedDatesInRange && calculateAvailableDays > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{i18n.rentCar.selectRentalPeriod}</CardTitle>
        <CardDescription>{i18n.rentCar.selectRentalPeriodDescription}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="mb-1">{i18n.rentCar.selectDates}</Label>
          <Calendar
            mode="range"
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            disabled={disabledDates}
            className="mt-2"
          />
        </div>

        {startDate && endDate && (
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{i18n.rentCar.startDate}</span>
              <span className="text-sm font-medium">{startDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{i18n.rentCar.endDate}</span>
              <span className="text-sm font-medium">{endDate.toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">{i18n.rentCar.availableDays}</span>
              <span className="text-sm font-medium">
                {calculateAvailableDays} {calculateAvailableDays === 1 ? i18n.rentCar.day : i18n.rentCar.days}
              </span>
            </div>
            {hasBlockedDatesInRange && (
              <div className="text-xs text-destructive font-medium">
                {i18n.rentCar.blockedDatesWarning}
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">{i18n.rentCar.totalPrice}</span>
              <span className="text-lg font-bold text-primary">${calculateTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        )}

        <Button
          onClick={handleRent}
          disabled={!canRent || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? i18n.rentCar.processing : canRent ? i18n.rentCar.rentCar : i18n.rentCar.selectDatesToRent}
        </Button>

        {reservations.length > 0 && (
          <div className="text-xs text-muted-foreground">
            <p className="font-semibold mb-1">{i18n.rentCar.blockedDates}</p>
            <ul className="space-y-1">
              {reservations.map((reservation, index) => (
                <li key={index}>
                  {new Date(reservation.startDateTime).toLocaleDateString()} - {new Date(reservation.endDateTime).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RentalCalendar;

