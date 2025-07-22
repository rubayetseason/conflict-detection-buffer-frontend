import { z } from "zod";

export const bookingSchema = z
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
  )
  .refine(
    (data) => {
      const start = new Date(data.date);
      start.setHours(data.from.getHours(), data.from.getMinutes());
      const end = new Date(data.date);
      end.setHours(data.to.getHours(), data.to.getMinutes());

      const diffInMinutes = (end.getTime() - start.getTime()) / 1000 / 60;
      return diffInMinutes <= 120;
    },
    {
      message: "Maximum duration is 2 hours",
      path: ["to"],
    }
  );

export type BookingFormSchema = z.infer<typeof bookingSchema>;
