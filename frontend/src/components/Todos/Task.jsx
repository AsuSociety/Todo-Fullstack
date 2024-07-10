import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const profiles = [
  {
    value: "batman",
    label: "Batman",
    icon_src: "https://cdn4.iconfinder.com/data/icons/avatars-xmas-giveaway/128/batman_hero_avatar_comics-1024.png"
  },
  {
    value: "charmander",
    label: "Charmander",
    icon_src: "https://cdn-icons-png.flaticon.com/128/188/188990.png"
  },
  {
    value: "pikachu",
    label: "Pikachu",
    icon_src: "https://cdn-icons-png.flaticon.com/128/188/188987.png"
  },
  {
    value: "balbazor",
    label: "Balbazor",
    icon_src: "https://cdn-icons-png.flaticon.com/128/188/188989.png"
  },
  {
    value: "meowth",
    label: "Meowth",
    icon_src: "https://cdn-icons-png.flaticon.com/128/188/188997.png"
  },
];

export const Task = ({ open, onClose, task, user }) => {
  const [selectedIconSrc, setSelectedIconSrc] = useState("");

  useEffect(() => {
    // console.log("User icon:", user.icon);
    const initialIcon = profiles.find(profile => profile.value === user.icon);
    setSelectedIconSrc(initialIcon ? initialIcon.icon_src : "");
  }, [user.icon]);

  // console.log("Selected Icon Src in Task component:", selectedIconSrc);

  if (!task) return null; // Handle cases where task might be null or undefined

  const imageUrl = task.photo_path ? `/path/to/uploads/${task.photo_path}` : null;

  return (
    <Dialog open={open} onOpenChange={onClose} key={selectedIconSrc}>
      <DialogContent className="sm:max-w-[800px] p-6 bg-white rounded-lg shadow-lg flex">
        <div className="w-2/3 pr-4">
          <DialogHeader className="border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold">{task.title}</DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Details about your task.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="mb-4">
              <p className="font-medium">Description:</p>
              <p className="text-gray-700">{task.body}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Status:</p>
              <p className="text-sm" style={{ color: task.color }}>
                {task.status}
              </p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Deadline:</p>
              <p className="text-gray-700">{task.deadline}</p>
            </div>
            {imageUrl && (
              <div className="mb-4">
                <p className="font-medium">Photo:</p>
                <img
                  src={imageUrl}
                  alt="Task Photo"
                  className="w-full h-auto rounded-md shadow-sm"
                />
              </div>
            )}
            {/* Add more details as needed */}
          </div>
        </div>
        <div className="w-1/3 pl-4 border-l border-gray-200">
          <div className="mb-4">
            <p className="font-medium">Assignee:</p>
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedIconSrc} alt="@avatar-icon" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <p className="text-gray-700 ml-2">{user.first_name}{" "}{user.last_name}</p> {/* Add margin-left for spacing */}
            </div>
          </div>
          <div className="mb-4">
            <p className="font-medium">Reporter:</p>
            {/* <p className="text-gray-700">{task.reporter}</p> */}
          </div>
          <div className="mb-4">
            <p className="font-medium">Priority:</p>
            {/* <p className="text-gray-700">{task.priority}</p> */}
          </div>
          <div className="mb-4">
            <p className="font-medium">Labels:</p>
            {/* <p className="text-gray-700">{task.labels.join(', ')}</p> */}
          </div>
          <div className="mb-4">
            <p className="font-medium">Start Date:</p>
            {/* <p className="text-gray-700">{task.start_date}</p> */}
          </div>
          {/* Add more details as needed */}
        </div>
      </DialogContent>
    </Dialog>
  );
}
