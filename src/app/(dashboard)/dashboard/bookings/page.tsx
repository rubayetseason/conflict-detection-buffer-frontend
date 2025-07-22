"use client";

import { IBookingType } from "@/app/types";
import { ContentLayout } from "@/components/dashboard/content-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateBookingModal from "./_components/CreateBookingModal";
import { DeleteBooking } from "./_components/DeleteBookingModal";
import Filters from "./_components/Filters";

export default function BookingDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<IBookingType[]>([]);
  const [refetch, setRefetch] = useState(false);

  const getBookings = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/bookings");
      console.log(res?.data?.data.data);
      if (res?.data?.success) {
        setBookings(res.data.data.data);
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookings();
  }, [refetch]);

  return (
    <ContentLayout title="Resource Bookings">
      <div className="p-4 md:p-8 space-y-6 font-poppins">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <CreateBookingModal></CreateBookingModal>
        </div>

        <div>
          <Filters></Filters>
        </div>
        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : bookings?.length > 0 ? (
          <div className="rounded-lg border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Requested By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Start</TableHead>
                  <TableHead>End</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell>{booking.resource}</TableCell>
                    <TableCell>{booking.requestedBy}</TableCell>
                    <TableCell>
                      {format(new Date(booking.startTime), "PPP")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.startTime), "p")}
                    </TableCell>
                    <TableCell>
                      {format(new Date(booking.endTime), "p")}
                    </TableCell>
                    <TableCell>
                      {/* Duration in minutes */}
                      {Math.round(
                        (new Date(booking.endTime).getTime() -
                          new Date(booking.startTime).getTime()) /
                          60000
                      )}{" "}
                      min
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">pending</Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <DeleteBooking
                        bookingId={booking.id}
                        setRefetch={setRefetch}
                        setLoading={setLoading}
                      ></DeleteBooking>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="py-12 flex justify-center items-center">
            <h1 className="text-2xl font-bold">No Bookings Found</h1>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-end items-center gap-4">
          <Button variant="outline" size="sm">
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </div>
    </ContentLayout>
  );
}
