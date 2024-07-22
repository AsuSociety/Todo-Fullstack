import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@/components/ui/select";

export const Toolbar = (props) => {
  const statusOptions = ["todo", "in progress", "done", "canceled"];
  const visibilityOptions = ["private", "company"];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={props.filterTitle}
          onChange={(event) => props.setFilterTitle(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        <Select
          value={props.filterStatus}
          onValueChange={(value) => props.setFilterStatus(value)}
        >
          <SelectTrigger className="h-8 w-[150px] lg:w-[250px]">
            <span>{props.filterStatus || "Filter by status..."}</span>
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={props.filterVisibility}
          onValueChange={(value) => props.setFilterVisibility(value)}
        >
          <SelectTrigger className="h-8 w-[150px] lg:w-[250px]">
            <span>{props.filterVisibility || "Filter by visibility..."}</span>
          </SelectTrigger>
          <SelectContent>
            {visibilityOptions.map((visibility) => (
              <SelectItem key={visibility} value={visibility}>
                {visibility}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          onClick={props.resetFilters}
          className="h-8 px-2 lg:px-3"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};
