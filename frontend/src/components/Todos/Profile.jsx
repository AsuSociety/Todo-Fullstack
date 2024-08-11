// Profile.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { profiles } from "./profiles.js";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
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

export const Profile = () => {
  const { user, logout, updateIcon } = useUser();
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [selectedIconTemp, setSelectedIconTemp] = useState(null);

  useEffect(() => {
    const initialIcon = profiles.find((profile) => profile.value === user.icon);
    setSelectedIcon(initialIcon || null);
  }, [user.icon]);

  const handleProfile = (icon, src) => {
    updateIcon(user.id, icon, user.token);
    setSelectedIconTemp(
      profiles.find((profile) => profile.value === icon) || null,
    );
    setOpen(false);
  };

  const handleSaves = () => {
    setSelectedIcon(selectedIconTemp);
    setIsDialogOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCompanyRegister = () => {
    navigate("/companyregister");
  };

  const handleCompanyPage = () => {
    navigate("/company");
  };

  const isCEO = user.role === "CEO";
  const isAdmin = user.role === "admin";

  const hasCompany = user.company_name;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={selectedIcon ? selectedIcon.icon_src : null}
                alt="@avatar-icon"
              />
              <AvatarFallback>User</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.username}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                Company: {user.company_name}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            {hasCompany ? (
              isAdmin || isCEO ? (
                <DropdownMenuItem onClick={handleCompanyPage}>
                  Company
                  <DropdownMenuShortcut>⇧⌘W</DropdownMenuShortcut>
                </DropdownMenuItem>
              ) : null
            ) : (
              <DropdownMenuItem onClick={handleCompanyRegister}>
                Create a company
                <DropdownMenuShortcut>⇧⌘W</DropdownMenuShortcut>
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-center">
                Profile Icon
              </Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-[120px] justify-center border border-black"
                  >
                    {selectedIconTemp ? (
                      <>
                        <img
                          src={selectedIconTemp.icon_src}
                          className="mr-2 h-4 w-4 shrink-0"
                          alt="Profile Icon"
                        />
                        {selectedIconTemp.label}
                      </>
                    ) : (
                      <>
                        {selectedIcon ? (
                          <>
                            <img
                              src={selectedIcon.icon_src}
                              className="mr-2 h-4 w-4 shrink-0"
                              alt="Profile Icon"
                            />
                            {selectedIcon.label}
                          </>
                        ) : (
                          <>+ Set profile</>
                        )}
                      </>
                    )}
                  </Button>
                </PopoverTrigger>

                <PopoverContent
                  className="p-0 w-[200px]"
                  side="right"
                  align="start"
                >
                  <Command>
                    <CommandInput placeholder="Change profile..." />
                    <CommandList>
                      <CommandEmpty>No results found.</CommandEmpty>
                      <CommandGroup>
                        {profiles.map((profile) => (
                          <CommandItem
                            key={profile.value}
                            value={profile.value}
                            onSelect={(value) =>
                              handleProfile(profile.value, profile.icon_src)
                            }
                          >
                            <img
                              src={profile.icon_src}
                              className="mr-2 h-4 w-4 shrink-0"
                              alt="Profile Icon"
                            />
                            <span>{profile.label}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <button
              type="button"
              onClick={handleSaves}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
