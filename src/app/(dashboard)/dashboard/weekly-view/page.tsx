"use client";

import { IBookingType } from "@/types";
import { ContentLayout } from "@/components/dashboard/content-layout";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axiosInstance from "@/utils/axios";
import { addDays, format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import WeeklyCalendar from "./_components/WeeklyCalendar";

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

        <WeeklyCalendar
          loading={loading}
          weekDates={weekDates}
          hours={hours}
          bookings={bookings}
        ></WeeklyCalendar>
      </div>
    </ContentLayout>
  );
};

export default WeeklyViewPage;
