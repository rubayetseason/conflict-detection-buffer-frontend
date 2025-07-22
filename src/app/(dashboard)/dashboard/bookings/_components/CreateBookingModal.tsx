"use client";

import { TimePicker12Demo } from "@/components/shared/time-picker-12h-demo";
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
import { JWT_TOKEN_PASS } from "@/constants";
import { cn } from "@/lib/utils";
import { BookingFormSchema, bookingSchema } from "@/schemas/bookingSchema";
import axiosInstance from "@/utils/axios";
import { jwtDecode } from "@/utils/jwtDecode";
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

  const token = localStorage.getItem(JWT_TOKEN_PASS);
  const user = token ? jwtDecode(token) : null;

  const onSubmit = async (values: BookingFormSchema) => {
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
      userId: user?.id,
    };

    try {
      const res = await axiosInstance.post("/bookings", payload);
      if (res?.data?.success) {
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
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
