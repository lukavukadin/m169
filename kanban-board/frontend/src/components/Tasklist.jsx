function TaskList({ tasks }) {
  return (
    <div>
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <strong>{task.title}</strong>: {task.description} [{task.status}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
