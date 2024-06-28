import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPalette } from "@fortawesome/free-solid-svg-icons";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "../UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter
} from "@/components/ui/table";

export const Todo = (props) => {
  const colors = ["#6b7280", "#4b5563", "#374151", "#1f2937", "#71717a"];
  const { user } = useUser();
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [taskColor, setTaskColor] = useState(props.task.color || colors[0]);
  const [editedTitle, setEditedTitle] = useState(props.task.title);
  const [editedBody, setEditedBody] = useState(props.task.body);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const editTask = async (id, title, body, token) => {
    try {
      const response = await fetch(`http://localhost:8000/todo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: id,
          title: title,
          body: body,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to update task: ${response.status} - ${response.statusText}`
        );
      }

      const updatedTodo = await response.json();
      return updatedTodo;
    } catch (error) {
      console.error("Error updating task:", error);
      return null;
    }
  };

  const handleSave = async () => {
    const updatedTask = await editTask(
      props.task.id,
      editedTitle,
      editedBody,
      user.token
    );
    if (updatedTask) {
      props.setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo.id === props.task.id ? updatedTask : todo))
      );
      setIsDialogOpen(false);
    } else {
      console.error("Task update failed.");
    }
  };

  const handleColorChange = (color) => {
    setTaskColor(color);
    setShowColorPicker(false);
    props.updateTaskColor(props.task.id, color);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Task</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Edit</TableHead>
            <TableHead className="text-right">Delete</TableHead>
            <TableHead className="text-right">Color</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow style={{ backgroundColor: taskColor }}>
            <TableCell className="font-medium">
              {props.task.title}
              <p className="text-sm">{props.task.body}</p>
            </TableCell>
            <TableCell>Pending</TableCell>
            <TableCell className="text-right">
              <FontAwesomeIcon
                icon={faPen}
                className="text-gray-600 cursor-pointer hover:text-blue-500"
                onClick={() => setIsDialogOpen(true)}
              />
            </TableCell>
            <TableCell className="text-right">
              <FontAwesomeIcon
                icon={faTrash}
                className="text-gray-600 cursor-pointer hover:text-red-500"
                onClick={() => props.deleteTodo(props.task.id)}
              />
            </TableCell>
            <TableCell className="text-right">
              <FontAwesomeIcon
                icon={faPalette}
                className="text-gray-600 cursor-pointer hover:text-yellow-500"
                onClick={() => setShowColorPicker(!showColorPicker)}
              />
              {showColorPicker && (
                <div className="mt-2 flex space-x-2 p-2 bg-white rounded-lg shadow-lg border border-gray-200">
                  {colors.map((color) => (
                    <div
                      key={color}
                      className="w-8 h-8 rounded-lg cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorChange(color)}
                    ></div>
                  ))}
                </div>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Make changes to your task here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Task Title
              </Label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="body" className="text-right">
                Task Body
              </Label>
              <Input
                id="body"
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <button
              type="button"
              onClick={handleSave}
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
