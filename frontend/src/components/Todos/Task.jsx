// // Task.js

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";

// import { useParams, useLocation } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// export const Task = () => {
//   const { id } = useParams();
//   const location = useLocation();
//   const { todo } = location.state || {};
//   const navigate = useNavigate();

//   React.useEffect(() => {
//     if (!todo) {
//       // Fetch task details if todo is not provided through state
//       fetchTask(id);
//     }
//   }, [id, todo]);

//   const fetchTask = async (taskId) => {
//     const response = await fetch(`/api/tasks/${taskId}`);
//     const task = await response.json();
//     console.log("Task Details:", task);
//   };

//   function handleBack() {
//     navigate("/todos");
// }
//   return (
//     <div className="container mx-auto p-4">
//       {todo ? (
//         <div className="flex flex-col space-y-8 p-8 border rounded-md shadow-md">
//           <div className="flex items-center justify-between">
//             <div>
//               <h2 className="text-2xl font-bold tracking-tight mb-2">{todo.title}</h2>
//               <p className="text-gray-600 mb-4">{todo.body}</p>
//               {todo.photo_path && (
//                 <div className="mt-4">
//                   <img
//                     src= {todo.photo_path}
//                     alt={todo.title}
//                     className="max-w-full h-auto rounded-md"
//                   />
//                 </div>
//               )}
//             </div>
//             <div className="flex items-center space-x-2">
//             <button onClick={handleBack}> Back</button>
//         </div>
//           </div>
//         </div>
//       ) : (
//         <p className="text-gray-600">Loading task details...</p>
//       )}
//     </div>
//   );
// };
export const Task = ({ open, onClose, task }) => {
    if (!task) return null; // Handle cases where task might be null or undefined

    const imageUrl = task.photo_path ? `/path/to/uploads/${task.photo_path}` : null;

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] p-6 bg-white rounded-lg shadow-lg">
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
              <p className={`text-sm ${task.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                {task.status}
              </p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Deadline:</p>
              <p className="text-gray-700">{task.deadline}</p>
            </div>
            <div className="mb-4">
              <p className="font-medium">Color:</p>
              <p className="text-gray-700">
                <span 
                  className="inline-block w-24 h-6 rounded"
                  style={{ backgroundColor: task.color }}
                >
                </span>
              </p>
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
          <DialogFooter className="flex justify-end border-t border-gray-200 pt-4">
            <Button onClick={onClose} className="bg-blue-500 hover:bg-blue-600 text-white">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
}