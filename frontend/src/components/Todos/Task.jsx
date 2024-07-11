import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {profiles} from "./profiles.js"

export const Task = ({ open, onClose, task, user, handleSave }) => {
  const [selectedIconSrc, setSelectedIconSrc] = useState("");
  const [photoUrls, setPhotoUrls] = useState([]);
  const [error, setError] = useState(null);
  const [isAddTodoVisible, setIsAddTodoVisible] = useState(false); // State hook to control the visibility of AddTodo form
  const [isEditing, setIsEditing] = useState(false); // State hook to control the editing mode
  const [editedBody, setEditedBody] = useState(""); // State hook for the edited task body

  useEffect(() => {
    if (user) {
      const initialIcon = profiles.find(
        (profile) => profile.value === user.icon,
      );
      setSelectedIconSrc(initialIcon ? initialIcon.icon_src : "");
    }
  }, [user]);

  useEffect(() => {
    if (open && task) {
      setEditedBody(task.body || ""); // Ensure editedBody reflects task body

      axios
        .get(`http://localhost:8000/todo/${task.id}/photos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        .then((response) => {
          setPhotoUrls(response.data.photos || []);
          setError(null); // Clear any previous errors
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setError("No photos found for this task");
          } else {
            setError("Error fetching photos");
          }
          console.error("Error fetching photos:", error);
        });
    }
  }, [open, task?.id]); // Depend on `open` and `task.id`

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleBodyChange = (e) => {
    setEditedBody(e.target.value);
  };
  const handleSaves = () => {
    handleSave(
      {
        title: task.title,
        body: editedBody,
        color: task.color,
        status: task.status,
        deadline: task.deadline,
      },
      task.id,
    );
    setIsEditing(false);
  }

  if (!task) return null;

  const formattedDeadline = format(new Date(task.deadline), "MMMM d, yyyy"); // Format date here

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden p-6 bg-white rounded-lg shadow-lg flex">
        <div className="w-2/3 pr-4 flex flex-col overflow-auto">
          <DialogHeader className="border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold">
              {task.title}
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Details about your task.
            </DialogDescription>
            </DialogHeader>
          <div className="py-4 flex-grow">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="font-medium">Description:</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={editedBody}
                    onChange={handleBodyChange}
                    className="border border-gray-300 rounded px-2 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-700">{task.body}</p>
                )}
              </div>
              <button
                onClick={isEditing ? handleSaves : handleEditToggle}
                className=" py-1 px-1 rounded transition duration-300 text-xs"
              >
                {isEditing ? "Save" : "Edit Task"}
              </button>
            </div>

            {photoUrls.length > 0 && (
              <div className="mb-4">
                <p className="font-medium">Photos:</p>
                <div className="flex flex-wrap gap-2">
                  {photoUrls.map((url, index) => (
                    <div key={index} className="w-32 h-32 overflow-hidden">
                      <img
                        src={url}
                        alt={`Task Photo ${index}`}
                        className="w-full h-full object-contain rounded-md shadow-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div className="w-1/3 pl-4 border-l border-gray-200 flex-shrink-0">
          <div className="mb-4">
            <p className="font-medium">Assignee:</p>
            <div className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={selectedIconSrc} alt="@avatar-icon" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <p className="text-gray-700 ml-2">
                {user.first_name} {user.last_name}
              </p>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-medium">Status:</p>
            <p className="text-sm" style={{ color: task.color }}>
              {task.status}
            </p>
          </div>
          <div className="mb-4">
            <p className="font-medium">Deadline:</p>
            <p className="text-gray-700">{formattedDeadline}</p>
          </div>
          {/* <div className="mb-4">
            <p className="font-medium">Priority:</p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
