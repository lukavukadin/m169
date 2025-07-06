import { useState } from "react";

function TaskItem({ task, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask({ ...editedTask, [name]: value });
  };

  const handleSave = () => {
    onUpdate(editedTask);
    setIsEditing(false);
  };

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
          <button onClick={() => setIsEditing(false)}>Abbrechen</button>
        </>
      ) : (
        <>
          <strong>{task.title}</strong>: {task.description} [{task.status}]
          <button onClick={() => setIsEditing(true)}>Bearbeiten</button>
          <button onClick={() => onDelete(task._id)}>Löschen</button>
        </>
      )}
    </li>
  );
}

export default TaskItem;
