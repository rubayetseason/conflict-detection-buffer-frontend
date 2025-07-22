"use client";

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
import { format } from "date-fns";
import { Pencil, Plus, Trash } from "lucide-react";

const mockBookings = [
  {
    id: "1",
    resource: "Room A",
    requestedBy: "Alice",
    startTime: "2025-07-23T10:00",
    endTime: "2025-07-23T11:00",
    status: "Upcoming",
  },
  {
    id: "2",
    resource: "Room B",
    requestedBy: "Bob",
    startTime: "2025-07-22T09:00",
    endTime: "2025-07-22T10:30",
    status: "Past",
  },
];

export default function BookingDashboardPage() {
  return (
    <ContentLayout title="Resource Bookings">
      <div className="p-4 md:p-8 space-y-6 font-poppins">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Booking
          </Button>
        </div>
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.resource}</TableCell>
                  <TableCell>{booking.requestedBy}</TableCell>
                  <TableCell>
                    {format(new Date(booking.startTime), "p")}
                  </TableCell>
                  <TableCell>
                    {format(new Date(booking.endTime), "p")}
                  </TableCell>
                  <TableCell>difference will come here</TableCell>
                  <TableCell>
                    <Badge variant="outline">{booking.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Trash className="w-4 h-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

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
