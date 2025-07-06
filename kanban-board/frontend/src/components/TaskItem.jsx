function TaskItem({ task, onDelete }) {
  return (
    <li>
      <strong>{task.title}</strong>: {task.description} [{task.status}]
      <button onClick={() => onDelete(task._id)} style={{ marginLeft: "10px" }}>
        Löschen
      </button>
    </li>
  );
}

export default TaskItem;
