"use client";

import { Badge } from "@/components/ui/badge";

type StatusBadgeProps = {
  startTime: string | Date;
  endTime: string | Date;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  startTime,
  endTime,
}) => {
  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  let status: "Upcoming" | "Ongoing" | "Past" = "Upcoming";
  let badgeClass = "";

  if (now < start) {
    status = "Upcoming";
    badgeClass = "bg-blue-500 text-white dark:bg-blue-600";
  } else if (now >= start && now <= end) {
    status = "Ongoing";
    badgeClass = "bg-yellow-500 text-black dark:bg-yellow-400";
  } else {
    status = "Past";
    badgeClass = "bg-gray-500 text-white dark:bg-gray-600";
  }

  return <Badge className={badgeClass}>{status}</Badge>;
};
