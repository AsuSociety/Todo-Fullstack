// CalendarView.jsx
import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Card } from "@/components/ui/card"; // Adjust the import path if needed
import { Task } from "./Task"; // Adjust the import path if needed

const localizer = momentLocalizer(moment);
const DraggableCalendar = withDragAndDrop(Calendar);

export const CalendarView = (props) => {
  const [events, setEvents] = useState([]);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (props.selectedTask) {
      setSelectedTodo(props.selectedTask);
      setOpen(true);
      props.setSelectedTask(null); // Clear selected task after opening
    }
  }, [props.selectedTask]);

  useEffect(() => {
    if (props.tasks && props.tasks.length) {
      const newEvents = props.tasks.map((task) => {
        const deadline = new Date(task.deadline);
        return {
          title: task.title,
          body: task.body,
          start: deadline,
          end: deadline,
          allDay: true,
          taskId: task.id,
          isCompleted: task.isCompleted,
          color: task.color || "#007bff", // Default color if task color is not defined
        };
      });
      setEvents(newEvents);
    }
  }, [props.tasks]);

  const handleDeadline = (date) => {
    if (date) {
      const normalizedDate = props.normalizeDate(date);
      const utcDate = props.convertToUTCISO(normalizedDate);
      props.handleAddTask(utcDate);
    }
  };

  const handleSelectSlot = ({ start }) => {
    handleDeadline(start);
  };

  const handleOpenDialog = (event) => {
    const task = props.tasks.find((task) => task.id === event.taskId);
    if (task) {
      setSelectedTodo(task);
      setOpen(true);
    }
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedTodo(null);
  };

  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.color,
      borderRadius: "4px",
      color: "white",
      border: "none",
      padding: "2px 4px",
      cursor: "pointer",
    };
    return { style };
  };

  const onEventDrop = async ({ event, start, end }) => {
    const taskId = event.taskId;
    const newDeadline = start; // Assuming start is the new deadline after drop

    // Update the task with the new deadline
    await props.updateDeadline(taskId, newDeadline);
  };


  return (
    <Card className="container mx-auto p-4 bg-white shadow-md rounded-md">
      <div className="h-full w-full">
        <DraggableCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleOpenDialog}
          eventPropGetter={eventStyleGetter}
          onEventDrop={onEventDrop}
          style={{ height: "80vh", width: "100%" }}
        />
      </div>

      <Task
        open={open}
        onClose={handleCloseDialog}
        task={selectedTodo}
        handleSave={props.handleSave}
        handleDeletePhoto={props.handleDeletePhoto}
      />
    </Card>
  );
};
