import TaskItem from "./TaskItem";

function TaskList({ tasks, setTasks }) {
  const handleDeleteTask = (id) => {
    fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: "DELETE",
    }).then(() => {
      setTasks(tasks.filter((task) => task._id !== id));
    });
  };

  const handleUpdateTask = (updatedTask) => {
    fetch(`http://localhost:5000/api/tasks/${updatedTask._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((data) => {
        setTasks(
          tasks.map((task) => (task._id === data._id ? data : task))
        );
      });
  };

  return (
    <div>
      <h2>Tasks:</h2>
      <ul>
        {tasks.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={handleDeleteTask}
            onUpdate={handleUpdateTask}
          />
        ))}
      </ul>
    </div>
  );
}

export default TaskList;