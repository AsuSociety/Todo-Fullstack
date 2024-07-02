
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
    const now = new Date();

    newDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
    return newDate;
  };

  // Convert local date to UTC ISO string, fix the problem with the different time
  const convertToUTCISO = (date) => {
    // Assuming date is a Date object
    const localDate = new Date(date);
    // Get year, month, date, hours, minutes, seconds, and milliseconds
    const year = localDate.getFullYear();
    const month = localDate.getMonth();
    const day = localDate.getDate();
    const hours = localDate.getHours();
    const minutes = localDate.getMinutes();
    const seconds = localDate.getSeconds();
    const milliseconds = localDate.getMilliseconds();
    
    // Create a new UTC date object
    const utcDate = new Date(Date.UTC(year, month, day, hours, minutes, seconds, milliseconds));
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

