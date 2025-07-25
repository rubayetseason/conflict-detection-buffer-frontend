"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker12Demo } from "@/components/ui/time-picker-12h-demo";
import { cn } from "@/lib/utils";
import { BookingFormSchema, bookingSchema } from "@/schemas/bookingSchema";
import bookingService from "@/services/bookingService";
import { getUserFromToken } from "@/utils/authUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { format } from "date-fns";
import { CalendarIcon, Plus } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateBookingModal({
  setRefetch,
}: {
  setRefetch: Dispatch<SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);

  const now = new Date();
  const nextHour = new Date(now.setHours(now.getHours() + 1, 0, 0, 0));

  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      resource: "",
      requestedBy: "",
      date: new Date(),
      from: new Date(),
      to: nextHour,
    },
  });

  const user = getUserFromToken();

  // Add these at the top inside your component
  const [checking, setChecking] = useState(false);

  // Watch field values
  const selectedResource = form.watch("resource");
  const selectedDate = form.watch("date");
  const selectedFrom = form.watch("from");
  const selectedTo = form.watch("to");

  const isCheckDisabled =
    !selectedResource || !selectedDate || !selectedFrom || !selectedTo;

  const checkAvailability = async () => {
    if (isCheckDisabled) return;

    const mergeDateAndTime = (date: Date, time: Date): Date => {
      const merged = new Date(date);
      merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
      return merged;
    };

    const startTime = mergeDateAndTime(selectedDate, selectedFrom);
    const endTime = mergeDateAndTime(selectedDate, selectedTo);

    try {
      setChecking(true);

      const result = await bookingService.checkAvailability({
        resource: selectedResource,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
      });

      if (result.available) {
        toast.success("Slot is available!");
      } else {
        toast.error("Slot is not available.");
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      toast.error("An error occurred");
    } finally {
      setChecking(false);
    }
  };

  const onSubmit = async (values: BookingFormSchema) => {
    const mergeDateAndTime = (date: Date, time: Date): Date => {
      const merged = new Date(date);
      merged.setHours(time.getHours(), time.getMinutes(), 0, 0);
      return merged;
    };

    const startTime = mergeDateAndTime(values.date, values.from);
    const endTime = mergeDateAndTime(values.date, values.to);

    const payload = {
      resource: values.resource,
      requestedBy: values.requestedBy,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      userId: user?.id ?? "",
    };

    try {
      const res = await bookingService.createBooking(payload);
      if (res?.success) {
        setOpen(false);
        setRefetch((prev) => !prev);
        toast.success("Booking created successfully!");
        form.reset();
      }
    } catch (error) {
      if (error instanceof AxiosError)
        return toast.error(error.response?.data.message);
      toast.error("An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a Booking</DialogTitle>
          <DialogDescription>
            Fill in the form below to create a booking.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resource</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a resource" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Resource 1">Resource 1</SelectItem>
                      <SelectItem value="Resource 2">Resource 2</SelectItem>
                      <SelectItem value="Resource 3">Resource 3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="requestedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested By</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* DATE PICKER */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* FROM TIME PICKER */}
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <TimePicker12Demo
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TO TIME PICKER */}
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <TimePicker12Demo
                      date={field.value}
                      setDate={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="button"
              disabled={isCheckDisabled || checking}
              onClick={checkAvailability}
              variant="outline"
            >
              {checking ? "Checking..." : "Check Availability"}
            </Button>

            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
