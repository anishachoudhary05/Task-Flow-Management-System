function TaskCard({ task, onStatusChange, onEdit, onDelete }) {

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-700",
    "In Progress": "bg-blue-100 text-blue-700",
    Completed: "bg-green-100 text-green-700",
  };

  const priorityColors = {
    High: "text-red-600",
    Medium: "text-orange-600",
    Low: "text-green-600",
  };

  const today = new Date().toLocaleDateString("en-CA");

  const isOverdue =
    task.dueDate &&
    task.dueDate < today &&
    task.status !== "Completed";

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition">

      <div className="flex justify-between items-start gap-3">

        <div>
          <h3 className="text-lg font-bold text-gray-800">
            {task.title}
          </h3>

          <p className="text-sm text-gray-500 mt-2">
            {task.description}
          </p>
        </div>

        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[task.status]}`}>
          {task.status}
        </span>

      </div>

      <div className="mt-4">

        <p className={`text-sm font-semibold ${priorityColors[task.priority]}`}>
          {task.priority} Priority
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Due Date: {task.dueDate || "Not set"}
        </p>

        {isOverdue && (
          <p className="text-sm font-semibold text-red-600 mt-2">
            Overdue Task!
          </p>
        )}

      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 mt-5">

        <div className="flex flex-wrap gap-2">

          <select
            value={task.status}
            onChange={e => onStatusChange(task.id, e.target.value)}
            className="border rounded-lg px-2 py-1 text-sm"
          >
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

          <button
            onClick={() => onEdit(task)}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm"
          >
            Edit
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-sm"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}

export default TaskCard;