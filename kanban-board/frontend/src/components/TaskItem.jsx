import { useState } from "react";
import "./TaskItem.css";

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  function handleChange(e) {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    fetch(`http://44.194.82.214:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        onUpdate(updatedTask);
        setIsEditing(false);
      });
  }

  return (
    <div className="task-card">
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedTask.title}
            onChange={handleChange}
            className="task-input"
            placeholder="Titel"
          />
          <input
            name="description"
            value={editedTask.description}
            onChange={handleChange}
            className="task-input"
            placeholder="Beschreibung"
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
            className="task-select"
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="task-buttons">
            <button onClick={handleSave} className="btn save">Speichern</button>
            <button onClick={() => setIsEditing(false)} className="btn cancel">Abbrechen</button>
          </div>
        </>
      ) : (
        <>
          <h3>{task.title}</h3>
          <p>{task.description}</p>
          <span className="badge">{task.status}</span>
          <div className="task-buttons">
            <button onClick={() => setIsEditing(true)} className="btn edit">Bearbeiten</button>
            <button onClick={() => onDelete(task._id)} className="btn delete">Löschen</button>
          </div>
        </>
      )}
    </div>
  );
}

export default TaskItem;
