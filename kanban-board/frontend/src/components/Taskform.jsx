import { useState } from "react";
import "./TaskForm.css";

function TaskForm({ setTasks }) {
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "todo",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:5000/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    })
      .then((res) => res.json())
      .then((newTask) => {
        setTasks((prev) => [...prev, newTask]);
        setTask({ title: "", description: "", status: "todo" });
      });
  }

  return (
    <form onSubmit={handleSubmit} className="taskform">
      <input
        type="text"
        name="title"
        value={task.title}
        onChange={handleChange}
        placeholder="Titel"
        required
      />
      <input
        type="text"
        name="description"
        value={task.description}
        onChange={handleChange}
        placeholder="Beschreibung"
        required
      />
      <select name="status" value={task.status} onChange={handleChange}>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Erstellen</button>
    </form>
  );
}

export default TaskForm;
