"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { ChevronDownIcon, SortAsc, SortDesc } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

const Filters = ({
  dateRange,
  setDateRange,
  resource,
  setResource,
  sortOrder,
  setSortOrder,
  setCurrentPage,
}: {
  dateRange: { start: string; end: string } | undefined;
  setDateRange: (range: { start: string; end: string } | undefined) => void;
  resource: string;
  setResource: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}) => {
  const [open, setOpen] = useState(false);

  const displayDate = dateRange
    ? format(new Date(dateRange.start), "PP")
    : "Select date";

  return (
    <div>
      <div className="flex items-center gap-4">
        <Select value={resource} onValueChange={setResource}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Resources" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="Resource 1">Resource 1</SelectItem>
              <SelectItem value="Resource 2">Resource 2</SelectItem>
              <SelectItem value="Resource 3">Resource 3</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-48 justify-between font-normal"
            >
              {displayDate}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateRange ? new Date(dateRange.start) : undefined}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                if (selectedDate) {
                  const start = new Date(selectedDate);
                  start.setHours(0, 0, 0, 0);
                  const end = new Date(selectedDate);
                  end.setHours(23, 59, 59, 999);

                  setDateRange({
                    start: start.toISOString(),
                    end: end.toISOString(),
                  });

                  setOpen(false);
                  setCurrentPage(1);
                }
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
          }
        >
          {sortOrder === "asc" ? (
            <SortAsc className="w-4 h-4" />
          ) : (
            <SortDesc className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default Filters;
