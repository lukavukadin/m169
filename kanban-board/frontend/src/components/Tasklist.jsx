import TaskItem from "./TaskItem";
import "./TaskList.css";

function TaskList({ tasks, onDelete, onUpdate }) {
  const groupedTasks = {
    todo: tasks.filter((task) => task.status === "todo"),
    inprogress: tasks.filter((task) => task.status === "inprogress"),
    done: tasks.filter((task) => task.status === "done"),
  };

  return (
    <div className="board">
      <div className="column todo">
        <h2>To Do</h2>
        {groupedTasks.todo.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <div className="column inprogress">
        <h2>In Progress</h2>
        {groupedTasks.inprogress.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
      <div className="column done">
        <h2>Done</h2>
        {groupedTasks.done.map((task) => (
          <TaskItem
            key={task._id}
            task={task}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
}

export default TaskList;
