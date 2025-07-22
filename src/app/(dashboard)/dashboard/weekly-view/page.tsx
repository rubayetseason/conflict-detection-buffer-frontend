"use client";

import { IBookingType } from "@/app/types";
import { ContentLayout } from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { resourceColors } from "@/constants";
import { cn } from "@/lib/utils";
import axiosInstance from "@/utils/axios";
import { addDays, addHours, format, startOfDay } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const hours = Array.from({ length: 24 }, (_, i) =>
  format(new Date(0, 0, 0, i), "h a")
);

const WeeklyViewPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<IBookingType[]>([]);
  const [loading, setLoading] = useState(false);
  const weekDates = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfDay(date), i)
  );

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/bookings/weekly-booking", {
          params: { date: date.toISOString() },
        });

        if (res?.data?.success) {
          const transformed = res.data.data.map((b: IBookingType) => ({
            ...b,
            startTime: new Date(b.startTime),
            endTime: new Date(b.endTime),
          }));
          setBookings(transformed);
        }
      } catch (error) {
        console.error("Error fetching bookings", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [date]);

  return (
    <ContentLayout title="Weekly View">
      <div className="p-4 space-y-6 font-poppins">
        <div className="flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold">Weekly View</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(date, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(d) => d && setDate(d)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

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
              <>
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
                                resourceColors[booking.resource] ||
                                  "bg-gray-500"
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
              </>
            ))}
          </div>
        )}
      </div>
    </ContentLayout>
  );
};

export default WeeklyViewPage;
