import { useEffect, useState } from "react";
import TaskItem from "./TaskItem";

function TaskList({ tasks, setTasks }) {
  // Task löschen
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Nach dem Löschen: Tasks im State aktualisieren
          setTasks((prevTasks) => prevTasks.filter((task) => task._id !== id));
        } else {
          console.error("Fehler beim Löschen des Tasks");
        }
      })
      .catch((err) => console.error("Fehler:", err));
  };

  return (
    <div>
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onDelete={handleDelete} />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
