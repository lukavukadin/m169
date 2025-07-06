import { useState } from "react";

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  function handleChange(e) {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  }

  function handleSave() {
    fetch(`http://localhost:5000/api/tasks/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedTask),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        onUpdate(updatedTask); // update list in parent
        setIsEditing(false);
      });
  }

  return (
    <li>
      {isEditing ? (
        <>
          <input
            name="title"
            value={editedTask.title}
            onChange={handleChange}
          />
          <input
            name="description"
            value={editedTask.description}
            onChange={handleChange}
          />
          <select
            name="status"
            value={editedTask.status}
            onChange={handleChange}
          >
            <option value="todo">To Do</option>
            <option value="inprogress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <button onClick={handleSave}>Speichern</button>
        </>
      ) : (
        <>
          <strong>{task.title}</strong>: {task.description} [{task.status}]
          <button onClick={() => setIsEditing(true)}>Bearbeiten</button>
        </>
      )}
      <button onClick={() => onDelete(task._id)}>Löschen</button>
    </li>
  );
}

export default TaskItem;
