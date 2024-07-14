import React, { useState, useRef, useEffect } from "react"; // Import React and necessary hooks
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import { ChangeStatus } from "./ChangeStatus";
import { DatePicker } from "./DatePicker";
import { Task } from "./Task";

import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";


import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const colors = [
  "#ef4444",
  "#f59e0b",
  "#84cc16",
  "#99f6e4",
  "#bfdbfe",
  "#FFFFFF",
];

export const TaskTable = (props) => {
  const [isChecked, setIsChecked] = useState();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);


  useEffect(() => {
    if (props.selectedTask) {
      setSelectedTodo(props.selectedTask);
      setOpen(true);
      props.setSelectedTask(null); // Clear selected task after opening
    }
  }, [props.selectedTask]);


  const handleCheckboxChange = (taskId, currentValue) => {
    const newValue = !currentValue;
    props.updateRemainder(taskId, newValue);
    setIsChecked(newValue);
    if (newValue) {
      alert("You will receive a reminder 24 hours before the deadline!");
    }
  };
  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));

  };

  const handleOpenDialog = (todo) => {
    setSelectedTodo(todo);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  return (
    <div>
      <Table
        className="table-auto border-collapse border border-gray-300"
        style={{ tableLayout: "fixed" }}
      >
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px] border border-gray-300">
              Task
            </TableHead>
            <TableHead className="text-center  w-[80px] border border-gray-300">
              Status
            </TableHead>
            <TableHead className="text-center w-[70px] border border-gray-300">
              Date
            </TableHead>
            <TableHead className="text-center w-[20px]  border border-gray-300">
              Remainder
            </TableHead>
            <TableHead
              className="text-center border border-gray-300"
              style={{ width: "20px", padding: "0px" }}
            >
              Photo
            </TableHead>
            <TableHead
              className="text-center border border-gray-300"
              style={{ width: "20px", padding: "0px" }}
            >
              Delete
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.tasks.map((todo) => (
            <TableRow key={todo.id} className="border border-gray-300">
              <TableCell
                className="font-medium font-bold border border-gray-300 "
                onClick={() => handleOpenDialog(todo)}
              >
                {todo.title}
                <p className="text-sm font-thin ">{todo.body}</p>
              </TableCell>
              <TableCell
                className="text-center border border-gray-300  "
                style={{ backgroundColor: todo.color }}
              >
                <ChangeStatus
                  updateTaskStatus={props.updateTaskStatus}
                  id={todo.id}
                  currentStatus={todo.status}
                />
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <DatePicker
                  updateDeadline={props.updateDeadline}
                  todo={todo}
                  currentDeadline={todo.deadline}
                  updateRemainder={props.updateRemainder}
                  normalizeDate={props.normalizeDate}
                  convertToUTCISO={props.convertToUTCISO}
                />
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={todo.remainder}
                    onCheckedChange={() =>
                      handleCheckboxChange(todo.id, todo.remainder)
                    }
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remaind Me!
                  </label>
                </div>
              </TableCell>

              <TableCell className="text-center border border-gray-300">
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
                  onClick={() => props.handleUploadClick(todo.id, selectedFiles)}
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </TableCell>
              <TableCell className="text-center border border-gray-300 ">
                <FontAwesomeIcon
                  icon={faTrash}
                  className="text-gray-600 cursor-pointer hover:text-red-500"
                  onClick={() => props.deleteTodo(todo.id)}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Task
        open={open}
        onClose={handleCloseDialog}
        task={selectedTodo}
        handleSave={props.handleSave}
        handleDeletePhoto={props.handleDeletePhoto}
      />
    </div>
  );
};
