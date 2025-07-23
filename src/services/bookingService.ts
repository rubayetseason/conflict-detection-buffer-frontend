import {
  CheckAvailabilityParams,
  CreateBookingPayload,
  GetPaginatedParams,
} from "@/types";
import axiosInstance from "@/utils/axios";

/**
 * Create a new booking
 * @param payload - booking info
 * @returns created booking
 */
const createBooking = async (payload: CreateBookingPayload) => {
  const res = await axiosInstance.post("/bookings", payload);
  return res.data;
};

/**
 * Check availability of a slot
 * @param params - resource, startTime, endTime
 * @returns true if available, false otherwise
 */
const checkAvailability = async (params: CheckAvailabilityParams) => {
  const res = await axiosInstance.get("/bookings/available-slots", {
    params,
  });
  return res.data;
};

const deleteBooking = async (bookingId: string) => {
  const res = await axiosInstance.delete(`/bookings/${bookingId}`);
  return res.data;
};

const getPaginatedBookings = async ({
  page,
  limit,
  sortOrder,
  selectedDate,
  selectedResource,
}: GetPaginatedParams) => {
  const params: Record<string, string | number> = {
    page,
    limit,
    sort_by: "startTime",
    sort_order: sortOrder,
  };

  if (selectedDate) params.date = selectedDate.toISOString();
  if (selectedResource) params.resource = selectedResource;

  const res = await axiosInstance.get("/bookings", { params });
  return res.data;
};

const getWeeklyBookings = async (date: Date) => {
  const res = await axiosInstance.get("/bookings/weekly-booking", {
    params: { date: date.toISOString() },
  });
  return res.data;
};

const bookingService = {
  createBooking,
  checkAvailability,
  deleteBooking,
  getPaginatedBookings,
  getWeeklyBookings,
};

export default bookingService;
