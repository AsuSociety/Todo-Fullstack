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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { profiles } from "./profiles.js";
import { useUser } from "../UserContext";

const speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new speechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

export const Task = ({ open, onClose, task, handleSave }) => {
  const { user } = useUser();
  const [selectedIconSrc, setSelectedIconSrc] = useState("");
  const [photoUrls, setPhotoUrls] = useState([]);
  const [error, setError] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(null);

  useEffect(() => {
    if (user) {
      const initialIcon = profiles.find(
        (profile) => profile.value === user.icon
      );
      setSelectedIconSrc(initialIcon ? initialIcon.icon_src : "");
    }
  }, [user]);

  useEffect(() => {
    if (open && task) {
      setEditedTitle(task.title || ""); 
      setEditedBody(task.body || ""); 
      setPhotoUrls(task.photo_urls || []);

      setError(null);
    }
  }, [open, task]);

  useEffect(() => {
    if (isListening) {
      mic.start();
      mic.onend = () => {
        console.log("Continue..");
        mic.start();
      };
    } else {
      mic.stop();
      mic.onend = () => {
        console.log("Stop..");
      };
    }

    mic.onstart = () => {
      console.log("Mics On");
    };

    mic.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("");
      
      if (activeField === "title") {
        setEditedTitle(transcript);
      } else if (activeField === "body") {
        setEditedBody(transcript);
      }
    };

    mic.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    return () => {
      mic.stop();
      mic.onend = null;
      mic.onresult = null;
      mic.onerror = null;
    };
  }, [isListening, activeField]);

  const handleMicClick = (field) => {
    if (isListening) {
      mic.stop();
      setIsListening(false);
    } else {
      setActiveField(field);
      setIsListening(true);
    }
  };

  const handleSaveClick = () => {
    handleSave(
      {
        title: editedTitle,
        body: editedBody,
        color: task.color,
        status: task.status,
        deadline: task.deadline,
      },
      task.id
    );
    onClose();
  };

  if (!task) return null;

  const formattedDeadline = format(new Date(task.deadline), "MMMM d, yyyy");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-hidden p-6 bg-white rounded-lg shadow-lg flex">
        <div className="w-2/3 pr-4 flex flex-col overflow-auto">
          <DialogHeader className="border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold">
              <div className="flex items-center">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="text-xl font-semibold border border-gray-300 rounded px-2 py-1 w-full"
                />
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className={`text-gray-600 cursor-pointer hover:text-blue-500 ml-2 ${
                    isListening && activeField === "title" ? "text-blue-500" : ""
                  }`}
                  onClick={() => handleMicClick("title")}
                />
              </div>
            </DialogTitle>
            <DialogDescription className="text-gray-500 mt-1">
              Details about your task.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 flex-grow">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center w-full">
                <p className="font-medium mr-2">Description:</p>
                <input
                  type="text"
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-full"
                />
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className={`text-gray-600 cursor-pointer hover:text-blue-500 ml-2 ${
                    isListening && activeField === "body" ? "text-blue-500" : ""
                  }`}
                  onClick={() => handleMicClick("body")}
                />
              </div>
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
          <button
            onClick={handleSaveClick}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
