import React, { useState, useEffect } from "react";
import { ChangeStatus } from "./ChangeStatus";
import { ChangeVisibility } from "./ChangeVisibility";
import { DatePicker } from "./DatePicker";
import { Task } from "./Task";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const TaskTable = (props) => {
  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    if (props.selectedTask) {
      setSelectedTodo(props.selectedTask);
      setOpen(true);
      props.setSelectedTask(null);
    }
  }, [props.selectedTask]);

  useEffect(() => {
    setSelectAll(selectedTasks.length === props.tasks.length);
  }, [selectedTasks, props.tasks.length]);

  const handleCheckboxChange = (taskId, currentValue) => {
    const newValue = !currentValue;
    props.updateRemainder(taskId, newValue);
    if (newValue) {
      alert("You will receive a reminder 24 hours before the deadline!");
    }
  };

  const handleDeleteCheckbox = (taskId) => {
    setSelectedTasks((prevSelected) => {
      const newSelectedTasks = prevSelected.includes(taskId)
        ? prevSelected.filter((id) => id !== taskId)
        : [...prevSelected, taskId];

      setSelectAll(newSelectedTasks.length === props.tasks.length);
      return newSelectedTasks;
    });
  };

  const handleDeleteSelected = () => {
    selectedTasks.forEach((taskId) => {
      props.deleteTodo(taskId);
    });
    setSelectedTasks([]);
    setSelectAll(false);
  };

  const handleOpenDialog = (todo) => {
    setSelectedTodo(todo);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedTasks([]);
    } else {
      setSelectedTasks(props.tasks.map((todo) => todo.id));
    }
    setSelectAll(!selectAll);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table
          className="table-auto border-collapse border border-gray-300"
          style={{ tableLayout: "fixed" }}
        >
          <TableHeader>
            <TableRow>
              <TableHead className="text-center w-[15px] border border-gray-300">
                <Checkbox
                  className="flex items-center"
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[280px] border border-gray-300">
                Task
              </TableHead>
              <TableHead className="text-center w-[40px] border border-gray-300">
                Visibility
              </TableHead>
              <TableHead className="text-center w-[50px] border border-gray-300">
                Status
              </TableHead>
              <TableHead className="text-center w-[70px] border border-gray-300">
                Date
              </TableHead>
              <TableHead className="text-center w-[20px] border border-gray-300">
                Remainder
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.tasks.map((todo) => (
              <TableRow key={todo.id} className="border border-gray-300">
                <TableCell className="text-center border border-gray-300 justify-center">
                  <Checkbox
                    className="flex items-center justify-center"
                    id={`checkbox-${todo.id}`}
                    checked={selectedTasks.includes(todo.id)}
                    onCheckedChange={() => handleDeleteCheckbox(todo.id)}
                    disabled={todo.owner_id !== props.user.id}
                  />
                </TableCell>
                <TableCell
                  className="border border-gray-300 p-2 cursor-pointer"
                  onClick={() => handleOpenDialog(todo)}
                >
                  {todo.title}
                  <p className="text-sm font-thin">{todo.body}</p>
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-2">
                  {todo.owner_id === props.user.id ? (
                    <ChangeVisibility
                      updateVisibility={props.updateVisibility}
                      id={todo.id}
                      currentVisibility={todo.visibility}
                    />
                  ) : (
                    <p>{todo.visibility}</p>
                  )}
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-2">
                  <ChangeStatus
                    updateTaskStatus={props.updateTaskStatus}
                    id={todo.id}
                    currentStatus={todo.status}
                  />
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-2">
                  {todo.owner_id === props.user.id ? (
                    <DatePicker
                      updateDeadline={props.updateDeadline}
                      todo={todo}
                      currentDeadline={todo.deadline}
                      updateRemainder={props.updateRemainder}
                      normalizeDate={props.normalizeDate}
                      convertToUTCISO={props.convertToUTCISO}
                    />
                  ) : (
                    <p>
                      {new Date(todo.deadline).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </p>
                  )}
                </TableCell>
                <TableCell className="text-center  p-2 flex justify-center items-center h-16">
                  <Checkbox
                    className="flex items-center justify-center"
                    id="terms"
                    checked={todo.remainder}
                    onCheckedChange={() =>
                      handleCheckboxChange(todo.id, todo.remainder)
                    }
                    disabled={todo.owner_id !== props.user.id}
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
          updateAssignees={props.updateAssignees}
          updateTaskStatus={props.updateTaskStatus}
          handleUploadClick={props.handleUploadClick}
          updateTaskDescription={props.updateTaskDescription}
          updateTaskTitle={props.updateTaskTitle}
          updateDeadline={props.updateDeadline}
          updateRemainder={props.updateRemainder}
          normalizeDate={props.normalizeDate}
          convertToUTCISO={props.convertToUTCISO}
          updateVisibility={props.updateVisibility}
          deleteTodo={props.deleteTodo}
        />
      </div>
      {selectedTasks.length > 0 && (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 flex items-center bg-black bg-opacity-80 p-2 rounded-md shadow-lg">
          <span className="text-white text-sm font-semibold mr-2">
            {selectedTasks.length} tasks selected
          </span>
          <span
            onClick={() => {
              setSelectedTasks([]);
              setSelectAll(false);
            }}
            className="text-white text-sm cursor-pointer mr-12"
          >
            X
          </span>
          <button
            onClick={handleDeleteSelected}
            className="p-1 bg-white text-black text-sm rounded-md hover:bg-slate-200 transition"
          >
            Remove Tasks
          </button>
        </div>
      )}
    </div>
  );
};
