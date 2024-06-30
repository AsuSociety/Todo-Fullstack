import React, { useState, useEffect } from "react"; // Import React and necessary hooks


import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


const statuses = [
    // {
    //   value: "backlog",
    //   label: "Backlog",
    // },
    {
      value: "todo",
      label: "Todo",
      color: "#71717a"
    },
    {
      value: "in progress",
      label: "In Progress",
      color: "#f59e0b"
    },
    {
      value: "done",
      label: "Done",
      color: "#84cc16"

    },
    {
      value: "canceled",
      label: "Canceled",
      color: "#ef4444"

    },
  ];
  


export const ChangeStatus = (props) => {
    const [open, setOpen] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState( null)
    
      // Set the initial state based on the current task status
    useEffect(() => {
      const initialStatus = statuses.find((status) => status.value === props.currentStatus);
      setSelectedStatus(initialStatus || null);
    }, [props.currentStatus]);

    const handleStatus=( id, status, color) =>{
      props.updateTaskStatus(id, color, status)

      setSelectedStatus(
        statuses.find((priority) => priority.value === status) ||
          null
      )
      setOpen(false)  
  }

  return (
    <div className="text-center flex items-center space-x-4 justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[95px] justify-center border border-black"
            style={{ backgroundColor: selectedStatus?.color }}

          >
            {selectedStatus ? (
              <>
                {selectedStatus.label}
              </>
            ) : (
              <>+ Set status</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[200px]" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    color = {status.color}
                    style={{ backgroundColor: status.color }}
                    onSelect={(value) => handleStatus(props.id, status.value, status.color)}
                  >
                    <span>{status.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )

}
