"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, SortAsc, SortDesc } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { format } from "date-fns";

const Filters = ({
  date,
  setDate,
  resource,
  setResource,
  sortOrder,
  setSortOrder,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  resource: string;
  setResource: (value: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: Dispatch<SetStateAction<"asc" | "desc">>;
}) => {
  const [open, setOpen] = useState(false);

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
              id="date"
              className="w-48 justify-between font-normal"
            >
              {date ? format(date, "PP") : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout="dropdown"
              onSelect={(selectedDate) => {
                setDate(selectedDate);
                setOpen(false);
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
