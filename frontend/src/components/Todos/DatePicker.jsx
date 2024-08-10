import React, { useState, useEffect } from "react";
import { format, differenceInHours } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export const DatePicker = (props) => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the date prop is provided and update the state
    if (props.currentDeadline) {
      setDate(new Date(props.currentDeadline));
    }
  }, [props.currentDeadline]);

  const handleDeadline = (date) => {
    if (date) {
      const normalizedDate = props.normalizeDate(date);
      setDate(normalizedDate);
      props.updateDeadline(
        props.todo.id,
        props.convertToUTCISO(normalizedDate),
      );
      setOpen(false);
    }
  };

  const renderDate = () => {
    if (!date) return <span>Pick a date</span>;

    const now = new Date();
    const timeDifference = differenceInHours(date, now);

    if (timeDifference < 24) {
      return `${timeDifference} hours`;
    } else {
      return format(date, "PPP");
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] flex justify-center items-center text-left font-normal",
            !date && "text-muted-foreground",
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {renderDate()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-[250px] overflow-auto">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selected) => handleDeadline(selected)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};
