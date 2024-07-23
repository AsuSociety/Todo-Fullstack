import React, { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { KanbanColumn } from "./KanbanColumn";

const statuses = [
  { value: "todo", label: "Todo", color: "#71717a" },
  { value: "in progress", label: "In Progress", color: "#f59e0b" },
  { value: "done", label: "Done", color: "#84cc16" },
  { value: "canceled", label: "Canceled", color: "#ef4444" },
];

const getStatusColor = (status) => {
  const foundStatus = statuses.find(s => s.value === status);
  return foundStatus ? foundStatus.color : "#ffffff"; // default color
};

export const KanbanBoard = ({ tasks, updateTaskStatus }) => {
  const [completed, setCompleted] = useState([]);
  const [incomplete, setIncomplete] = useState([]);
  const [canceled, setCanceled] = useState([]);
  const [inProgress, setInProgress] = useState([]);

  useEffect(() => {
    setCompleted(tasks.filter((task) => task.status === "done"));
    setIncomplete(tasks.filter((task) => task.status === "todo"));
    setCanceled(tasks.filter((task) => task.status === "canceled"));
    setInProgress(tasks.filter((task) => task.status === "in progress"));
  }, [tasks]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination || source.droppableId === destination.droppableId) return;

    const task = findItemById(draggableId);
    if (!task) return;

    // Remove the task from the current column
    switch (source.droppableId) {
      case "1":
        setIncomplete(removeItemById(draggableId, incomplete));
        break;
      case "2":
        setInProgress(removeItemById(draggableId, inProgress));
        break;
      case "3":
        setCompleted(removeItemById(draggableId, completed));
        break;
      case "4":
        setCanceled(removeItemById(draggableId, canceled));
        break;
      default:
        return;
    }

    // Update the task status and add it to the new column
    const updatedStatus = mapDroppableIdToStatus(destination.droppableId);
    const updatedTask = { ...task, status: updatedStatus };
    const updatedColor = getStatusColor(updatedStatus);


    switch (destination.droppableId) {
      case "1":
        setIncomplete([...incomplete, updatedTask]);
        break;
      case "2":
        setInProgress([...inProgress, updatedTask]);
        break;
      case "3":
        setCompleted([...completed, updatedTask]);
        break;
      case "4":
        setCanceled([...canceled, updatedTask]);
        break;
      default:
        return;
    }

    // Update the task status on the server
    try {
      await updateTaskStatus(task.id, updatedColor, updatedStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
      // Optionally revert the state change if the update fails
    }
  };

  const findItemById = (id) => tasks.find((item) => item.id.toString() === id);
  const removeItemById = (id, array) => array.filter((item) => item.id.toString() !== id);

  const mapDroppableIdToStatus = (droppableId) => {
    switch (droppableId) {
      case "1":
        return "todo";
      case "2":
        return "in progress";
      case "3":
        return "done";
      case "4":
        return "canceled";
      default:
        return "todo";
    }
  };

  return (
<DragDropContext onDragEnd={handleDragEnd}>
      <h2 className="text-center text-xl font-bold mb-4">PROGRESS BOARD</h2>
      <div className="flex justify-between items-center flex-row w-[1300px] mx-auto">
        <KanbanColumn
          title="TO DO"
          tasks={incomplete}
          id="1"
          color={getStatusColor("todo")}
        />
        <KanbanColumn
          title="IN PROGRESS"
          tasks={inProgress}
          id="2"
          color={getStatusColor("in progress")}
        />
        <KanbanColumn
          title="DONE"
          tasks={completed}
          id="3"
          color={getStatusColor("done")}
        />
        <KanbanColumn
          title="CANCELED"
          tasks={canceled}
          id="4"
          color={getStatusColor("canceled")}
        />
      </div>
    </DragDropContext>
  );
};
