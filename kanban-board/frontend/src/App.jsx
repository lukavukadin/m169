import { useEffect, useState } from "react";
import TaskForm from "./components/TaskForm.jsx";
import TaskList from "./components/Tasklist.jsx";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetch("http://backend:5000/api/tasks")
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((err) => console.error("Fehler beim Laden der Tasks:", err));
  }, []);

  // Funktion zum Löschen
  function handleDeleteTask(id) {
    fetch(`http://backend:5000/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  }

  // Funktion zum Aktualisieren
  function handleUpdateTask(updatedTask) {
    fetch(`http://backend:5000/api/tasks/${updatedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(tasks.map((task) => (task._id === data._id ? data : task)));
      });
  }

  return (
    <div className="app-container">
      <h1 className="title">Kanban Board</h1>

      <div className="task-form-container">
        <h2>Task erstellen</h2>
        <TaskForm setTasks={setTasks} />
      </div>

      <TaskList
        tasks={tasks}
        setTasks={setTasks}
        onDelete={handleDeleteTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
}

export default App;