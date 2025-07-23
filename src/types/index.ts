export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
}

export interface IBookingType {
  id: string;
  resource: string;
  requestedBy: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  userId: string;
}

export interface CreateBookingPayload {
  resource: string;
  requestedBy: string;
  startTime: string;
  endTime: string;
  userId: string;
}

export interface CheckAvailabilityParams {
  resource: string;
  startTime: string;
  endTime: string;
}

export interface GetPaginatedParams {
  page: number;
  limit: number;
  sortOrder: "asc" | "desc";
  selectedDateRange?: { start: string; end: string };
  selectedResource?: string;
}
