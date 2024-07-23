import React from "react";
import { Droppable } from "react-beautiful-dnd";
import { KanbanCards } from "./KanbanCards";

export const KanbanColumn = ({ id, title, tasks, color }) => {
  return (
    <div className="bg-gray-100 border border-gray-300 rounded-md w-96 h-[900px] overflow-y-scroll no-scrollbar">
      <h3 className="p-2 bg-blue-200 text-center sticky top-0">{title}</h3>
      <Droppable droppableId={id}>
        {(provided, snapshot) => {
          const containerClassName = `p-1 flex-grow min-h-[100px] transition-colors duration-200 ${
            snapshot.isDraggingOver ? "bg-gray-200" : "bg-gray-100"
          }`;

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={containerClassName}
              // style={{ backgroundColor: color }}

            >
              {tasks.map((task, index) => (
                <KanbanCards key={task.id} index={index} task={task} color={color}/>
              ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
