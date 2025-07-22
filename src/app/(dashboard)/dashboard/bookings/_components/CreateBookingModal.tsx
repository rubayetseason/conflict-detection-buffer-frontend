"use client";

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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { CalendarIcon, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { TimePicker12Demo } from "@/components/shared/time-picker-12h-demo";

const bookingSchema = z
  .object({
    resource: z.string().min(1, "Resource is required"),
    requestedBy: z.string().min(1, "Requested by is required"),
    date: z.date(),
    from: z.date(),
    to: z.date(),
  })
  .refine(
    (data) => {
      const start = new Date(data.date);
      start.setHours(data.from.getHours(), data.from.getMinutes());
      const end = new Date(data.date);
      end.setHours(data.to.getHours(), data.to.getMinutes());

      return end > start;
    },
    {
      message: "End time must be after start time",
      path: ["to"],
    }
  )
  .refine(
    (data) => {
      const start = new Date(data.date);
      start.setHours(data.from.getHours(), data.from.getMinutes());
      const end = new Date(data.date);
      end.setHours(data.to.getHours(), data.to.getMinutes());

      const diffInMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
      return diffInMinutes >= 15;
    },
    {
      message: "Minimum duration is 15 minutes",
      path: ["from"],
    }
  );

export type BookingFormSchema = z.infer<typeof bookingSchema>;

export default function CreateBookingModal() {
  const [open, setOpen] = useState(false);

  const form = useForm<BookingFormSchema>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      resource: "",
      requestedBy: "",
      date: new Date(),
      from: new Date(),
      to: new Date(),
    },
  });

  const onSubmit = (values: BookingFormSchema) => {
    const mergeDateAndTime = (date: Date, time: Date): Date => {
      const merged = new Date(date);
      merged.setHours(time.getHours());
      merged.setMinutes(time.getMinutes());
      merged.setSeconds(0);
      merged.setMilliseconds(0);
      return merged;
    };

    const startDateTime = mergeDateAndTime(values.date, values.from);
    const endDateTime = mergeDateAndTime(values.date, values.to);

    const payload = {
      resource: values.resource,
      requestedBy: values.requestedBy,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
    };

    console.log("Booking Created:", payload);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Booking
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
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
                  <FormControl>
                    <Input placeholder="e.g. Room A" {...field} />
                  </FormControl>
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
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
