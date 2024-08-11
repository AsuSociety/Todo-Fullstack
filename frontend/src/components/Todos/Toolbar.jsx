// Toolbar.jsx
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Toolbar = (props) => {
  const statusOptions = ["todo", "in progress", "done", "canceled"];
  const visibilityOptions = ["private", "company"];

  const handleStatusChange = (status) => {
    if (props.filterStatus.includes(status)) {
      props.setFilterStatus(props.filterStatus.filter((s) => s !== status));
    } else {
      props.setFilterStatus([...props.filterStatus, status]);
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter tasks..."
          value={props.filterTitle}
          onChange={(event) => props.setFilterTitle(event.target.value)}
          className="h-8 w-[150px] lg:w-[200px]"
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="h-8 w-auto max-w-[240px] text-left overflow-hidden"
            >
              {props.filterStatus.length > 0
                ? props.filterStatus.join(", ")
                : "Filter by status..."}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {statusOptions.map((status) => (
              <DropdownMenuCheckboxItem
                key={status}
                checked={props.filterStatus.includes(status)}
                onCheckedChange={() => handleStatusChange(status)}
              >
                {status}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-8 w-[150px] lg:w-[160px]">
              {props.filterVisibility || "Filter by visibility..."}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Filter by Visibility</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {visibilityOptions.map((visibility) => (
              <DropdownMenuCheckboxItem
                key={visibility}
                checked={props.filterVisibility === visibility}
                onCheckedChange={() => props.setFilterVisibility(visibility)}
              >
                {visibility}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

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
