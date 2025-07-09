import TaskItem from "./TaskItem";
import "./TaskList.css";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";

function TaskList({ tasks, setTasks, onDelete, onUpdate }) {
  const handleOnDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const draggedTask = tasks.find((task) => task._id === result.draggableId);

    const updatedTask = { ...draggedTask, status: destination.droppableId };

    fetch(`http://localhost:5000/api/tasks/${updatedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        const updatedList = tasks.map((task) =>
          task._id === data._id ? data : task
        );
        setTasks(updatedList);
      });
  };

  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "todo"),
    inprogress: tasks.filter((task) => task.status === "inprogress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <div className="board">
        {["todo", "inprogress", "done"].map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className={`column ${status}`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2>
                  {status === "todo"
                    ? "To Do"
                    : status === "inprogress"
                    ? "In Progress"
                    : "Done"}
                </h2>
                {groupedTasks[status].map((task, index) => (
                  <Draggable
                    key={task._id}
                    draggableId={task._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <TaskItem
                          task={task}
                          onDelete={onDelete}
                          onUpdate={onUpdate}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskList;
