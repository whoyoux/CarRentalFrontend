"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { i18n } from "@/lib/i18n";

export interface CalendarProps {
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  disabled?: (date: Date) => boolean;
  mode?: "single" | "range";
  startDate?: Date;
  endDate?: Date;
  onStartDateChange?: (date: Date | undefined) => void;
  onEndDateChange?: (date: Date | undefined) => void;
  className?: string;
}

const Calendar = ({
  selected,
  onSelect,
  disabled,
  mode = "single",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  className,
}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date): boolean => {
    if (disabled) {
      return disabled(date);
    }
    // Disable past dates
    return date < today;
  };

  const isDateInRange = (date: Date): boolean => {
    if (mode !== "range" || !startDate || !endDate) return false;
    return date >= startDate && date <= endDate;
  };

  const isDateSelected = (date: Date): boolean => {
    if (mode === "range") {
      if (startDate && date.getTime() === startDate.getTime()) return true;
      if (endDate && date.getTime() === endDate.getTime()) return true;
      return false;
    }
    return selected ? date.getTime() === selected.getTime() : false;
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;

    if (mode === "range") {
      if (!startDate || (startDate && endDate)) {
        // Start new range
        onStartDateChange?.(date);
        onEndDateChange?.(undefined);
      } else if (startDate && !endDate) {
        // Complete range
        if (date < startDate) {
          // If clicked date is before start, make it the new start
          onStartDateChange?.(date);
          onEndDateChange?.(startDate);
        } else {
          onEndDateChange?.(date);
        }
      }
    } else {
      onSelect?.(date);
    }
  };

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = i18n.calendar.months;
  const dayNames = i18n.calendar.days;

  return (
    <div className={cn("p-4 border rounded-lg bg-background", className)}>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={previousMonth}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextMonth}
          className="h-8 w-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((day) => (
          <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((date, index) => {
          if (!date) {
            return <div key={index} className="aspect-square" />;
          }

          const isDisabled = isDateDisabled(date);
          const isSelected = isDateSelected(date);
          const isInRange = isDateInRange(date);
          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={date.getTime()}
              type="button"
              onClick={() => handleDateClick(date)}
              disabled={isDisabled}
              className={cn(
                "aspect-square rounded-md text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isDisabled && "opacity-50 cursor-not-allowed text-muted-foreground",
                isSelected && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
                isInRange && !isSelected && "bg-accent text-accent-foreground",
                isToday && !isSelected && "border border-primary",
                !isDisabled && !isSelected && "hover:bg-accent"
              )}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export { Calendar };

