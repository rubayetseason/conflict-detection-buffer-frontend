import React from "react";
import { IBookingType } from "@/types";
import { resourceColors } from "@/constants";
import { cn } from "@/lib/utils";
import { addHours, format, startOfDay } from "date-fns";
import { Loader2 } from "lucide-react";

const WeeklyCalendar = ({
  loading,
  hours,
  weekDates,
  bookings,
}: {
  loading: boolean;
  hours: string[];
  weekDates: Date[];
  bookings: IBookingType[];
}) => {
  return (
    <div>
      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <Loader2 className="size-9 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-[80px_repeat(7,minmax(0,1fr))] border rounded overflow-x-auto text-sm">
          {/* Header Row */}
          <div className="bg-muted text-muted-foreground p-2 font-semibold border-r border-b">
            Time
          </div>
          {weekDates.map((d, i) => (
            <div
              key={i}
              className="bg-muted text-muted-foreground p-2 text-center font-semibold border-b"
            >
              {format(d, "EEE, MMM d")}
            </div>
          ))}

          {/* Grid Rows */}
          {hours.map((hourLabel, hourIdx) => (
            <React.Fragment key={hourIdx}>
              {/* Time label */}
              <div
                key={`time-${hourIdx}`}
                className="border-r border-b p-2 text-right text-xs text-muted-foreground"
              >
                {hourLabel}
              </div>

              {weekDates.map((dateCell, colIdx) => {
                const slotTime = addHours(startOfDay(dateCell), hourIdx);

                return (
                  <div
                    key={`cell-${hourIdx}-${colIdx}`}
                    className="relative h-20 border-b border-r cursor-pointer"
                  >
                    {bookings
                      .filter((b) => {
                        const start = new Date(b.startTime);
                        return (
                          start >= slotTime &&
                          start < addHours(slotTime, 1) &&
                          format(start, "yyyy-MM-dd") ===
                            format(dateCell, "yyyy-MM-dd")
                        );
                      })
                      .map((booking) => {
                        const start = new Date(booking.startTime);
                        const end = new Date(booking.endTime);
                        const durationMinutes =
                          (end.getTime() - start.getTime()) / (1000 * 60);
                        const minutesFromHourStart = start.getMinutes();

                        return (
                          <div
                            key={booking.id}
                            className={cn(
                              "absolute left-1 right-1 text-white rounded-md px-2 py-1 text-xs shadow-md overflow-hidden",
                              resourceColors[booking.resource] || "bg-gray-500"
                            )}
                            style={{
                              top: `${(minutesFromHourStart / 60) * 100}%`,
                              height: `${(durationMinutes / 60) * 100}%`,
                            }}
                          >
                            <p className="text-sm font-semibold">
                              {booking.resource}
                            </p>
                            <p className="text-[10px]">
                              {format(start, "p")} - {format(end, "p")}
                            </p>
                          </div>
                        );
                      })}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeeklyCalendar;
