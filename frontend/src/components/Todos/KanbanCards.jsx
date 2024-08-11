// KanbanCards.jsx
import React, { useState, useEffect } from "react";
import { Draggable } from "react-beautiful-dnd";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "../UserContext";
import { profiles } from "./profiles.js";

function bgcolorChange({ isDragging, isDraggable, isBacklog }) {
  if (isDragging) return "bg-green-200";
  if (isDraggable) return isBacklog ? "bg-red-200" : "bg-gray-200";
  return isBacklog ? "bg-red-200" : "bg-blue-200";
}

export const KanbanCards = ({ index, task, color }) => {
  const { user } = useUser();
  const [selectedIconSrc, setSelectedIconSrc] = useState("");

  useEffect(() => {
    if (user) {
      const initialIcon = profiles.find(
        (profile) => profile.value === user.icon,
      );
      setSelectedIconSrc(initialIcon ? initialIcon.icon_src : "");
    }
  }, [user]);

  return (
    <Draggable draggableId={`${task.id}`} key={task.id} index={index}>
      {(provided, snapshot) => {
        const backgroundColor = bgcolorChange({
          isDragging: snapshot.isDragging,
          isDraggable: true,
          isBacklog: task.isBacklog,
        });

        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className={`rounded-lg shadow-md p-4 mb-3 ml-3 mr-3 min-h-[150px] cursor-pointer flex flex-col justify-between ${backgroundColor} transition-all duration-200`}
          >
            <div
              className="flex items-center p-2 border-b border-gray-300"
              style={{ backgroundColor: color }}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={selectedIconSrc} alt="@avatar-icon" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <p className="text-gray-800 ml-3 font-semibold">
                {user.first_name} {user.last_name}
              </p>
            </div>
            <div
              className="flex flex-col p-2"
              style={{ backgroundColor: color }}
            >
              <h4 className="text-lg font-medium mb-1">{task.title}</h4>
              <p className="text-gray-600">{task.body}</p>
            </div>
            {provided.placeholder}
          </div>
        );
      }}
    </Draggable>
  );
};
