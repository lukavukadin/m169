import { useState } from "react";

function TaskForm({ setTasks }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newTask = { title, description, status };

    try {
      const response = await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTask),
      });

      const savedTask = await response.json();

      // Neuen Task zum bestehenden Array hinzufügen
      setTasks((prevTasks) => [...prevTasks, savedTask]);

      // Formular zurücksetzen
      setTitle("");
      setDescription("");
      setStatus("todo");
    } catch (error) {
      console.error("Fehler beim Erstellen des Tasks:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Neuen Task erstellen</h2>
      <input
        type="text"
        placeholder="Titel"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Beschreibung"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="todo">To Do</option>
        <option value="inprogress">In Progress</option>
        <option value="done">Done</option>
      </select>
      <button type="submit">Erstellen</button>
    </form>
  );
}

export default TaskForm;
