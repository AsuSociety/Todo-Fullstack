import React, { useState, useEffect } from "react"; // Import React and necessary hooks

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const visibilities = [
  {
    value: "private",
    label: "Private",
  },
  {
    value: "company",
    label: "Company",
  },
];

export const ChangeVisibility = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedVisibility, setselectedVisibility] = useState(null);

  useEffect(() => {
    const initialVisibility = visibilities.find(
      (visibility) => visibility.value === props.currentVisibility,
    );
    setselectedVisibility(initialVisibility || null);
  }, [props.currentVisibility]);

  const handleVisibility = (id, visibility) => {
    props.updateVisibility(id, visibility);

    setselectedVisibility(
      visibilities.find((priority) => priority.value === visibility) || null,
    );
    setOpen(false);
  };

  return (
    <div className="text-center flex items-center space-x-4 justify-center">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-[95px] justify-center border border-black"
            // style={{ backgroundColor: "white"}}
          >
            {selectedVisibility ? (
              <>{selectedVisibility.label}</>
            ) : (
              <>+ Set Visibility</>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[200px]" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change visibility..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {visibilities.map((visibility) => (
                  <CommandItem
                    key={visibility.value}
                    value={visibility.value}
                    // color={status.color}
                    // style={{ backgroundColor: "white" }}
                    onSelect={(value) =>
                      handleVisibility(props.id, visibility.value)
                    }
                  >
                    <span>{visibility.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
