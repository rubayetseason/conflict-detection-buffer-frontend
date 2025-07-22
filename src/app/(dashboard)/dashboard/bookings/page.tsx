"use client";

import { Pencil, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ContentLayout } from "@/components/dashboard/content-layout";

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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [resourceFilter, setResourceFilter] = useState<string>("");

  return (
    <ContentLayout title="Resource Bookings">
      <div className="p-4 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
          <h1 className="text-2xl font-bold">Bookings</h1>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Booking
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-full md:w-60">
            <Select value={resourceFilter} onValueChange={setResourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by resource" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Room A">Room A</SelectItem>
                <SelectItem value="Room B">Room B</SelectItem>
                <SelectItem value="Room C">Room C</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-60">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Resource</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
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
