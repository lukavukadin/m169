import TaskItem from "./TaskItem";
import "./Tasklist.css";
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

    if (!draggedTask || draggedTask.status === destination.droppableId) return;

    // 🟢 Optimistisch sofort aktualisieren
    const updatedTask = { ...draggedTask, status: destination.droppableId };

    const updatedList = tasks.map((task) =>
      task._id === updatedTask._id ? updatedTask : task
    );

    setTasks(updatedList); // ⬅️ Lokal sofort zeigen

    // 🔁 Danach Backend aktualisieren (async)
    fetch(`http://44.194.82.214:5000/api/tasks/${updatedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    }).catch((err) => {
      console.error("Fehler beim Aktualisieren:", err);
      // Optional: Bei Fehler Task wieder zurücksetzen
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
                    draggableId={task._id}
                    index={index}
                    key={task._id}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        key={task._id} // <- HIER ist die wichtige Änderung
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
                <div style={{ flexGrow: 1 }}></div>
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}

export default TaskList;
