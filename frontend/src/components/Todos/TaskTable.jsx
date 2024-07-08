import React, { useState } from "react"; // Import React and necessary hooks
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faTrash, faPalette, faMicrophone } from "@fortawesome/free-solid-svg-icons";
import { ChangeStatus } from "./ChangeStatus";
import { DatePicker } from "./DatePicker";

import { Checkbox } from "@/components/ui/checkbox"

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


const colors = ["#ef4444", "#f59e0b", "#84cc16", "#99f6e4", "#bfdbfe", "#FFFFFF"];



export const TaskTable = (props) => {
    // const [showColorPicker, setShowColorPicker] = useState(false);
    // const [selectedRowId, setSelectedRowId] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(null);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedBody, setEditedBody] = useState("");
    const [editedColor, setEditedColor] = useState("");
    const [editedStatus, setEditedStatus] = useState("");
    const [editedDate, setEditedDate] = useState("");
    const [isChecked, setIsChecked] = useState(); 

    
    // Function to handle opening the edit dialog
    const openEditDialog = (task) => {
        setEditedTask(task.id);
        setEditedTitle(task.title);
        setEditedBody(task.body);
        setEditedColor(task.color);
        setEditedStatus(task.status);
        setEditedDate(task.deadline)
        setIsDialogOpen(true);
    };

    
    // Function to handle saving the changes
    const handleSaves = () => {
        props.handleSave({ title: editedTitle, body: editedBody , color: editedColor, status: editedStatus, deadline: editedDate}, editedTask);
        setIsDialogOpen(false);
    };
    
       
  const handleCheckboxChange = (taskId, currentValue) => {
    const newValue = !currentValue;
    props.updateRemainder(taskId, newValue);
    setIsChecked(newValue);
    if (newValue) {
      alert("You will receive a reminder 24 hours before the deadline!");
    }
  }

    return(
        <div>
        <Table className="table-auto border-collapse border border-gray-300" style={{ tableLayout: 'fixed' }}>
        <TableHeader>
          <TableRow>
          <TableHead className="w-[180px] border border-gray-300">Task</TableHead>
      <TableHead className="text-center  w-[80px] border border-gray-300">Status</TableHead>
      <TableHead className="text-center w-[70px] border border-gray-300" >Date</TableHead>
      <TableHead className="text-center w-[20px]  border border-gray-300" >Remainder</TableHead>
      <TableHead className="text-center border border-gray-300" style={{ width: '20px', padding: '0px' }}>Edit</TableHead>
      <TableHead className="text-center border border-gray-300" style={{ width: '20px', padding: '0px' }}>Delete</TableHead>
    </TableRow>
        </TableHeader>
        <TableBody>
          {props.tasks.map((todo) => (
              <TableRow key={todo.id} className="border border-gray-300">
            <TableCell className="font-medium font-bold border border-gray-300 ">
              {todo.title}
              <p className="text-sm font-thin ">{todo.body}</p>
            </TableCell>
            <TableCell className="text-center border border-gray-300  " style={{ backgroundColor: todo.color } } >
              <ChangeStatus updateTaskStatus= {props.updateTaskStatus}
                            id= {todo.id}
                            currentStatus = {todo.status}
                            />
           
            </TableCell>
            <TableCell className="text-center border border-gray-300">
              <DatePicker updateDeadline = {props.updateDeadline}
                           todo= {todo}
                           currentDeadline ={todo.deadline}
                           updateRemainder = {props.updateRemainder}
                           normalizeDate = {props.normalizeDate}
                           convertToUTCISO = {props.convertToUTCISO}
                            />
            </TableCell>
            <TableCell className="text-center border border-gray-300">
               <div className="flex items-center space-x-2">
                 <Checkbox id="terms" checked={todo.remainder} onCheckedChange={() => handleCheckboxChange(todo.id,todo.remainder)}  />
                   <label
                       htmlFor="terms"
                     className="text-sm font-thin leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                    Remaind Me!
                 </label>
               </div>
    
            </TableCell>
            <TableCell className="text-center border border-gray-300 " >
              <FontAwesomeIcon
                icon={faPen}
                className="text-gray-600 cursor-pointer hover:text-blue-500"
                onClick={() => openEditDialog(todo)}
              />
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
              onClick={handleSaves}
              className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    )
}
