//Task.jsx
import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
// import { ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faTrashAlt,
  faImage,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { profiles } from "./profiles.js";
import { useUser } from "../UserContext";
import { AddAssignees } from "./AddAssignees.jsx";
import { ChangeVisibility } from "./ChangeVisibility";
import { ChangeStatus } from "./ChangeStatus";
import { DatePicker } from "./DatePicker";

const speechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const mic = new speechRecognition();
mic.continuous = true;
mic.interimResults = true;
mic.lang = "en-US";

export const Task = ({
  open,
  onClose,
  task,
  handleSave,
  handleDeletePhoto,
  updateAssignees,
  updateTaskStatus,
  handleUploadClick,
  updateTaskTitle,
  updateTaskDescription,
  updateDeadline,
  updateRemainder,
  normalizeDate,
  convertToUTCISO,
  updateVisibility,
  deleteTodo,
}) => {
  const { user, getUserById } = useUser();
  const [selectedIconSrc, setSelectedIconSrc] = useState("");
  const [selectedUserIconSrc, setSelectedUserIconSrc] = useState("");
  const [photoUrls, setPhotoUrls] = useState([]);
  const [photoIds, setPhotoIds] = useState([]);
  const [error, setError] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [creator, setCreator] = useState(null);
  const [assignee, setAssignee] = useState(null);
  const [showAddAssignees, setShowAddAssignees] = useState(false);
  const [selectedAssignees, setSelectedAssignees] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user && creator) {
      const initialIcon = profiles.find(
        (profile) => profile.value === creator.icon,
      );
      setSelectedIconSrc(initialIcon ? initialIcon.icon_src : "");
    }
  }, [user, creator]);

  useEffect(() => {
    if (open && task) {
      setEditedTitle(task.title);
      setEditedBody(task.body);
      setPhotoUrls(task.photo_urls || []);
      setPhotoIds(task.photo_ids || []);
      setError(null);
      setSelectedAssignees(task.assignee_id || null);
      setShowAddAssignees(task.visibility === "company");

      if (task.visibility === "company") {
        setShowAddAssignees(true);
      } else {
        setShowAddAssignees(false);
      }

      // Fetch user details if owner_id is present
      if (task.owner_id) {
        const fetchUserDetails = async () => {
          const token = user?.token;
          const fetchedUser = await getUserById(task.owner_id, token);
          if (fetchedUser) {
            setCreator(fetchedUser);
          } else {
            setError("Failed to fetch user details.");
          }
        };
        fetchUserDetails();
      }

      if (task.assignee_id) {
        const fetchUserDetails = async () => {
          const token = user?.token;
          const fetchedAssignee = await getUserById(task.assignee_id, token);
          const initialIcon = profiles.find(
            (profile) => profile.value === fetchedAssignee.icon,
          );
          setSelectedUserIconSrc(initialIcon ? initialIcon.icon_src : "");

          if (fetchedAssignee) {
            setAssignee(fetchedAssignee);
            setSelectedAssignees(task.assignee_id);
          } else {
            setError("Failed to fetch user details.");
          }
        };
        fetchUserDetails();
      } else {
        // Clear assignee state and icon if no assignee_id
        setAssignee(null);
        setSelectedUserIconSrc("");
        // setSelectedAssignees(null);
      }
    }
  }, [open, task, getUserById, user]);

  // Mic functions
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
        updateTaskTitle(task.id, transcript);
        setEditedTitle(transcript);
      } else if (activeField === "body") {
        updateTaskDescription(task.id, transcript);
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
        title: task.title,
        body: task.body,
        color: task.color,
        status: task.status,
        deadline: task.deadline,
        visibility: task.visibility,
        assignee_id: selectedAssignees,
      },
      task.id,
    );
    // console.log("blaaaaaaa",assignee)
    onClose();
  };

  useEffect(() => {
    if (task && task.photos) {
      const ids = task.photos.map((photo) => photo.id);
      const urls = task.photos.map((photo) => photo.url);
      setPhotoIds(ids);
      setPhotoUrls(urls);
    }
  }, [task]);

  const handlePhotoDelete = async (photoId) => {
    try {
      await handleDeletePhoto(photoId, task.id);

      // Find index of the photoId to remove
      const indexToRemove = photoIds.indexOf(photoId);

      // Update the photoIds and photoUrls states
      setPhotoIds((prevIds) => prevIds.filter((id) => id !== photoId));
      setPhotoUrls((prevUrls) =>
        prevUrls.filter((_, index) => index !== indexToRemove),
      );

      console.log(`Successfully deleted photo with ID: ${photoId}`);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setError("Failed to delete photo.");
    }
  };

  const handleToggleAddAssignees = () => {
    if (creator && creator.id === user.id && task.visibility === "company") {
      setShowAddAssignees(!showAddAssignees);
    }
  };

  useEffect(() => {
    if (assignee) {
      setShowAddAssignees(false);
    }
  }, [assignee]);

  useEffect(() => {
    if (open && task) {
      setSelectedAssignees(task.assignee_id || null);
    } else {
      setSelectedAssignees(null);
    }
  }, [open, task]);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    console.log("Selected files:", files); // Check selected files
    setSelectedFiles(files);
  };

  const handleClick = async () => {
    if (selectedFiles.length > 0) {
      try {
        // Call handleUploadClick with task.id and selectedFiles
        await handleUploadClick(task.id, selectedFiles, task);
        setSelectedFiles([]); // Clear selected files after upload
        console.log("Files uploaded and task updated successfully");
      } catch (error) {
        console.error("Error uploading files:", error);
        setError("Failed to upload files.");
      }
    }
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
    updateTaskTitle(task.id, e.target.value);
  };

  const handleBodyChange = (e) => {
    setEditedBody(e.target.value);
    updateTaskDescription(task.id, e.target.value);
  };

  // useEffect(() => {
  //   if (task && task.photo_ids && task.photo_urls) {
  //     const ids = task.photos.map((photo) => photo.id);
  //     const urls = task.photos.map((photo) => photo.url);
  //     setPhotoIds(ids);
  //     setPhotoUrls(urls);
  //     console.log('Fetched photo URLs:', urls); // Log URLs
  //   }
  // }, [task]);

  const handleDeleteClick = () => {
    if (task.owner_id === user.id) {
      deleteTodo(task.id);
      onClose(); // Close the dialog after deleting
    } else {
      alert("You do not have permission to delete this task.");
    }
  };

  if (!task) return null;

  // const formattedDeadline = format(new Date(task.deadline), "MMMM d, yyyy");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] min-h-[80vh] overflow-auto p-6 bg-white rounded-lg shadow-lg flex">
        <div className="w-2/3 pr-6 flex flex-col overflow-auto">
          <DialogHeader className="border-b border-gray-200">
            <DialogTitle className="text-xl font-semibold">
              <div className="flex items-center">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={handleTitleChange}
                  className="text-xl font-semibold border border-gray-300 rounded px-2 py-1 w-full"
                />
                <FontAwesomeIcon
                  icon={faMicrophone}
                  className={`text-gray-600 cursor-pointer hover:text-blue-500 ml-2 ${
                    isListening && activeField === "title"
                      ? "text-blue-500"
                      : ""
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
            <div className="mb-4 flex items-start">
              <div className="flex flex-col flex-grow">
                <textarea
                  value={editedBody}
                  onChange={handleBodyChange}
                  className="border border-gray-300 rounded px-2 py-1 w-full h-32 resize-none"
                  placeholder="Enter task description here..."
                />
              </div>
              <FontAwesomeIcon
                icon={faMicrophone}
                className={`text-gray-600 cursor-pointer hover:text-blue-500 ml-2 ${
                  isListening && activeField === "body" ? "text-blue-500" : ""
                }`}
                onClick={() => handleMicClick("body")}
              />
            </div>
            {photoIds.length > 0 && (
              <div className="mb-4">
                <p className="font-medium">Photos:</p>
                <div className="flex flex-wrap gap-2">
                  {photoIds.map((id, index) => (
                    <div
                      key={id}
                      className="w-32 h-32 overflow-hidden relative"
                    >
                      <img
                        src={photoUrls[index]}
                        alt={`Task Photo ${index}`}
                        className="w-full h-full object-contain rounded-md shadow-sm"
                      />
                      <button
                        onClick={() => handlePhotoDelete(id)}
                        className="absolute top-0 right-0 mt-1 mr-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        aria-label="Delete Photo"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
          </div>
        </div>
        <div className="w-1/3 pl-6 border-l border-gray-200 flex-shrink-0">
          <div className="mb-4">
            <p className="font-medium">Creator:</p>
            <div className="flex items-center">
              <Avatar className="h-12 w-12">
                <AvatarImage src={selectedIconSrc} alt="@avatar-icon" />
                <AvatarFallback>User</AvatarFallback>
              </Avatar>
              <p className="text-gray-700 ml-3">
                {creator
                  ? `${creator.firstname} ${creator.lastname} (${creator.role})`
                  : "Loading..."}
              </p>
            </div>
          </div>
          {task.visibility !== "private" && (
            <div className="mb-4">
              <p className="font-medium">Assignee:</p>
              {showAddAssignees ? (
                <AddAssignees
                  updateAssignees={updateAssignees}
                  task={task}
                  selectedAssignees={task.assignee_id}
                  setSelectedAssignees={setSelectedAssignees}
                />
              ) : (
                <div
                  className="flex items-center"
                  onClick={handleToggleAddAssignees}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={selectedUserIconSrc} alt="@avatar-icon" />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <p className="text-gray-700 ml-3">
                    {assignee
                      ? `${assignee.firstname} ${assignee.lastname} (${assignee.role})`
                      : "No Assignee yet..."}
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <p className="font-medium">Visibility:</p>
            <div className="flex justify-start">
              {task.owner_id === user.id ? (
                <ChangeVisibility
                  updateVisibility={updateVisibility}
                  id={task.id}
                  currentVisibility={task.visibility}
                />
              ) : (
                <p>{task.visibility}</p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium">Status:</p>
            <div className="flex justify-start">
              <ChangeStatus
                updateTaskStatus={updateTaskStatus}
                id={task.id}
                currentStatus={task.status}
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="font-medium">Deadline:</p>
            {/* <p className="text-gray-700">{formattedDeadline}</p> */}
            {task.owner_id === user.id ? (
              <DatePicker
                updateDeadline={updateDeadline}
                todo={task}
                currentDeadline={task.deadline}
                updateRemainder={updateRemainder}
                normalizeDate={normalizeDate}
                convertToUTCISO={convertToUTCISO}
              />
            ) : (
              <p>
                {new Date(task.deadline).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </p>
            )}
          </div>

          <div className="mb-4">
            <p className="font-medium">Uploade Photos:</p>
            <FontAwesomeIcon
              icon={faImage}
              className="text-gray-600 cursor-pointer hover:text-yellow-500"
              onClick={handleIconClick}
            />
            <input
              id="picture"
              name="image"
              type="file"
              onChange={handleFileChange}
              multiple
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <Button
              variant="outline"
              className="p-1 w-6 h-6 justify-center text-gray-600 cursor-pointer hover:text-yellow-500"
              onClick={handleClick}
            >
              +
            </Button>
          </div>
          <div className="absolute bottom-4 right-4">
          <Button
              onClick={handleDeleteClick}
              variant="outline"
              className="text-red-500 hover:text-red-600 border-none"
            >
              <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
            </Button>
          </div>

          {/* <div className="mt-auto">
            <button
              onClick={handleSaveClick}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full"
            >
              Save
            </button>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
