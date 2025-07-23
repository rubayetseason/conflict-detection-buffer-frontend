"use client";

import { IBookingType } from "@/types";
import { ContentLayout } from "@/components/dashboard/content-layout";
import { StatusBadge } from "@/components/shared/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_PAGE_SIZE } from "@/constants";
import { calculateDuration } from "@/helpers/calculateDuration";
import PaginationHandler from "@/helpers/PaginationHandler";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CreateBookingModal from "./_components/CreateBookingModal";
import { DeleteBooking } from "./_components/DeleteBookingModal";
import Filters from "./_components/Filters";
import bookingService from "@/services/bookingService";

export default function BookingDashboardPage() {
  const [loading, setLoading] = useState(false);
  const [bookings, setBookings] = useState<IBookingType[]>([]);
  const [refetch, setRefetch] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [selectedDateRange, setSelectedDateRange] = useState<{
    start: string;
    end: string;
  }>();
  const [selectedResource, setSelectedResource] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const getBookings = async () => {
    try {
      setLoading(true);

      const res = await bookingService.getPaginatedBookings({
        page: currentPage,
        limit: DEFAULT_PAGE_SIZE,
        sortOrder,
        selectedResource,
        selectedDateRange,
      });

      if (res?.success) {
        setTotalResults(res.data.meta.total);
        setBookings(res.data.data);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refetch, currentPage, selectedDateRange, selectedResource, sortOrder]);

  return (
    <ContentLayout title="Resource Bookings">
      <div className="p-4 md:p-8 space-y-6 font-poppins">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <CreateBookingModal setRefetch={setRefetch}></CreateBookingModal>
        </div>

        <div>
          <Filters
            dateRange={selectedDateRange}
            setDateRange={setSelectedDateRange}
            resource={selectedResource}
            setResource={setSelectedResource}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            setCurrentPage={setCurrentPage}
          />
        </div>

        <div className="px-4 py-3 rounded border bg-yellow-100 text-yellow-700 border-yellow-400 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700">
          <h1>
            Same resource cannot be booked during conflicting periods. Try
            booking a different available resource at that time.
          </h1>
        </div>

        {loading ? (
          <div className="py-12 flex justify-center items-center">
            <Loader2 className="size-8 animate-spin" />
          </div>
        ) : bookings?.length > 0 ? (
          <div className="">
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
                        {calculateDuration(
                          new Date(booking.startTime),
                          new Date(booking.endTime)
                        )}
                      </TableCell>
                      <TableCell>
                        <StatusBadge
                          startTime={booking.startTime}
                          endTime={booking.endTime}
                        />
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <DeleteBooking
                          bookingId={booking.id}
                          setRefetch={setRefetch}
                        ></DeleteBooking>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-5">
              <PaginationHandler
                totalResults={totalResults}
                currentPage={currentPage}
                setPageNumber={setCurrentPage}
              />
            </div>
          </div>
        ) : (
          <div className="py-12 flex justify-center items-center">
            <h1 className="text-2xl font-bold">No Bookings Found</h1>
          </div>
        )}
      </div>
    </ContentLayout>
  );
}
