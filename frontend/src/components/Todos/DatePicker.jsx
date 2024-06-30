
import React, { useState, useEffect } from "react"; 
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";



// Function to normalize date to start of the day in local timezone
const normalizeDate = (date) => {
    const newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  };

  // Convert local date to UTC ISO string, fix the problem with the different time
const convertToUTCISO = (date) => {
    const localDate = new Date(date);
    const utcDate = new Date(Date.UTC(localDate.getFullYear(), localDate.getMonth(), localDate.getDate()));
    return utcDate.toISOString();
  };
  
export const DatePicker = (props) => {
  const [date, setDate] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Check if the date prop is provided and update the state
    if (props.currentDeadline) {
      setDate(new Date(props.currentDeadline));
    }
  }, [props.currentDeadline]); 


  const handleDeadline=(date) =>{
    if(date){
        const normalizedDate = normalizeDate(date);
        setDate(normalizedDate);
        props.updateDeadline(props.id, convertToUTCISO(normalizedDate));
        setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[180px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 max-h-[250px] overflow-auto">
        <Calendar
          mode="single"
          selected={date}
        //   onSelect={setDate}
          onSelect={(selected) => handleDeadline(selected)}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

