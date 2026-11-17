import { useState, useEffect, useMemo} from "react";

const initialTasks = [
  {
    id: 1,
    title: "Complete React Project",
    description: "Build the internship task management dashboard.",
    status: "In Progress",
    priority: "High",
    date: "2026-11-15",
  },
  {
    id: 2,
    title: "Prepare for Interview",
    description: "Practice technical and HR interview questions.",
    status: "To Do",
    priority: "Medium",
    date: "2026-11-18",
  },
  {
    id: 3,
    title: "Learn JavaScript",
    description: "Practice promises, async and await.",
    status: "Completed",
    priority: "Low",
    date: "2026-11-10",
  },
  {
    id: 4,
    title: "Complete Assignment",
    description: "Finish the internship assignment.",
    status: "In Progress",
    priority: "High",
    date: "2026-11-13",
  },
];

const emptyForm = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  date: "",
};

export default function App() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    console.log("useEffect started");
  fetch("http://localhost:5001/api/tasks")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      return response.json();
    })
    .then((data) => {    
    console.log("API DATA: ", data);
    console.log("IS ARRAY: ",Array.isArray(data));
      setTasks(data);
    })
    .catch((error) => {
      console.error("Error fetching tasks:", error);
    });
}, []);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [sort, setSort] = useState("Newest");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const completed = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const progress = tasks.filter(
    (task) => task.status === "In Progress"
  ).length;

  const pending = tasks.filter(
    (task) => task.status === "To Do"
  ).length;

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === "All" || task.status === filter;

      return matchesSearch && matchesFilter;
    });

    if (sort === "Priority") {
      const order = { High: 1, Medium: 2, Low: 3 };
      result.sort(
        (a, b) => order[a.priority] - order[b.priority]
      );
    } else if (sort === "Oldest") {
      result.sort((a, b) => a.id - b.id);
    } else {
      result.sort((a, b) => b.id - a.id);
    }

    return result;
  }, [tasks, search, filter, sort]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(task) {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      date: task.date,
    });
    setShowForm(true);
  }


  async function handleSubmit(e) {
  e.preventDefault();

  if (!form.title.trim()) return;

  try {
   if (editingId !== null) {
  const response = await fetch(
    `http://localhost:5001/api/tasks/${editingId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update task");
  }

  const updatedResponse = await fetch(
    "http://localhost:5001/api/tasks"
  );

  const updatedTasks = await updatedResponse.json();

  setTasks(updatedTasks);
  setShowForm(false);
  setForm(emptyForm);
  setEditingId(null);

  alert("Task updated successfully!");
  return;
}

    const response = await fetch("http://localhost:5001/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: form.title,
        description: form.description,
        status: form.status,
        priority: form.priority,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to add task");
    }

    const updatedResponse = await fetch(
      "http://localhost:5001/api/tasks"
    );
    const updatedTasks = await updatedResponse.json();

    setTasks(updatedTasks);
    setShowForm(false);
    setForm(emptyForm);
    setEditingId(null);

    alert("Task saved successfully!");

  } catch (error) {
    console.log("Error:", error);
    alert("Task could not be saved!");
  }
}
async function deleteTask(id) {
  if (window.confirm("Are you sure you want to delete this task?")) {
    try {
      const response = await fetch(
        `http://localhost:5001/api/tasks/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete task");
      }

      setTasks((previous) =>
        previous.filter((task) => task.id !== id)
      );

      alert("Task deleted successfully!");

    } catch (error) {
      console.log("Delete error:", error);
      alert("Task could not be deleted!");
    }
  }
}
  function changeStatus(id, status) {
    setTasks((previous) =>
      previous.map((task) =>
        task.id === id ? { ...task, status } : task
      )
    );
  }

  const statusStyle = {
  "To Do": "bg-slate-100 text-slate-700 border border-slate-200",
  "In Progress": "bg-blue-50 text-blue-700 border border-blue-200",
  Completed: "bg-green-50 text-green-700 border border-green-200",
};

 const priorityStyle = {
  High: "text-red-700 bg-red-50 border border-red-200",
  Medium: "text-orange-700 bg-orange-50 border border-orange-200",
  Low: "text-green-700 bg-green-50 border border-green-200",
};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 md:flex">

      {/* Sidebar */}
      <aside className="w-full bg-white border-r border-slate-200 md:w-64 md:min-h-screen md:fixed md:inset-y-0">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-violet-700">
            ✦ TaskFlow
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage work. Achieve more.
          </p>
        </div>

<nav className="px-4 space-y-2 pb-5">
  <p className="text-xs uppercase text-slate-400 font-semibold px-3 mb-3">
    Workspace
  </p>

  <button
    onClick={() => setFilter("All")}
    className="w-full text-left bg-violet-50 text-violet-700 rounded-xl px-4 py-3 font-semibold hover:bg-violet-100 transition-all"
  >
    ▦ &nbsp; Dashboard
  </button>

  <button
    onClick={() => setFilter("All")}
    className="w-full text-left bg-violet-50 text-violet-700 rounded-xl px-4 py-3 font-semibold hover:bg-violet-100 transition-all"
  >
    ✓ &nbsp; My Tasks
  </button>

  <button
    onClick={() => setFilter("In Progress")}
    className="w-full text-left bg-violet-50 text-violet-700 rounded-xl px-4 py-3 font-semibold hover:bg-violet-100 transition-all"
  >
    ◷ &nbsp; In Progress
  </button>

  <button
    onClick={() => setFilter("Completed")}
    className="w-full text-left bg-violet-50 text-violet-700 rounded-xl px-4 py-3 font-semibold hover:bg-violet-100 transition-all"
  >
    ★ &nbsp; Completed
  </button>
</nav>
        <div className="hidden md:block absolute bottom-6 left-5 right-5 bg-violet-50 rounded-2xl p-4">
          <p className="font-semibold text-violet-800">
            Stay productive!
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Organize your work and reach your goals.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:ml-64 md:p-8">

        {/* Header */}
        <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <p className="text-sm text-slate-400">
              Workspace / Dashboard
            </p>
            <h2 className="text-3xl font-bold mt-2">
              Dashboard
            </h2>
            <p className="text-slate-500 mt-1">
              Welcome back! Here's your task overview.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-violet-200"
          >
            + Add New Task
          </button>
        </header>

        {/* Statistics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <StatCard
            title="Total Tasks"
            number={tasks.length}
            icon="▦"
            color="violet"
          />

          <StatCard
            title="Completed"
            number={completed}
            icon="✓"
            color="green"
          />

          <StatCard
            title="In Progress"
            number={progress}
            icon="◷"
            color="blue"
          />

          <StatCard
            title="To Do"
            number={pending}
            icon="○"
            color="orange"
          />

        </section>

        {/* Progress */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 mb-8">
          <div className="flex justify-between items-center mb-3">
            <div>
              <h3 className="font-bold text-lg">Overall Progress</h3>
              <p className="text-sm text-slate-400">
                Your task completion rate
              </p>
            </div>

            <span className="text-2xl font-bold text-violet-700">
              {tasks.length
                ? Math.round((completed / tasks.length) * 100)
                : 0}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
            <div
              className="bg-violet-600 h-full rounded-full transition-all"
              style={{
                width: `${
                  tasks.length
                    ? (completed / tasks.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </section>

        {/* Task Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 md:p-6">

          <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
            <div>
              <h3 className="text-xl font-bold">My Tasks</h3>
              <p className="text-sm text-slate-400 mt-1">
                Manage and track your activities
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-violet-300"
            />

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 outline-none"
            >
              <option>All</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-3 outline-none"
            >
              <option>Newest</option>
              <option>Oldest</option>
              <option>Priority</option>
            </select>

          </div>

          {/* Task Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

            {filteredTasks.map((task) => (
              <article
                key={task.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-violet-300 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="min-w-0">
                    <h4 className="font-bold text-lg text-slate-800 break-words">
                      {task.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                      {task.description}
                    </p>
                  </div>

                  <span className={`text-xs px-4 py-2 rounded-full font-semibold shrink-0 ${priorityStyle[task.priority]}`}>
                    {task.priority}
                  </span>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-3 mt-5">
                  <span className={`text-xs px-4 py-2 rounded-full font-semibold ${statusStyle[task.status]}`}>
                    {task.status}
                  </span>

                  <span className="text-xs text-slate-400">
                    Due: {task.date || "Not set"}
                  </span>
                </div>

                <div className="border-t border-slate-100 mt-4 pt-4 flex flex-wrap gap-2 justify-between">

                  <select
                    value={task.status}
                    onChange={(e) => changeStatus(task.id, e.target.value)}
                    className="text-xs border border-slate-200 rounded-lg p-2"
                  >
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(task)}
                      className="text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-100 px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 border border-red-100 px-4 py-2 rounded-lg transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>

                </div>
              </article>
            ))}

          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="font-semibold">No tasks found</p>
              <p className="text-sm mt-1">
                Try another search or add a new task.
              </p>
            </div>
          )}

        </section>

        <footer className="text-center text-slate-400 text-sm py-8">
          © 2026 TaskFlow. All rights reserved.
        </footer>
      </main>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl p-7 w-full max-w-lg shadow-2xl border border-slate-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-slate-800">
                {editingId !== null ? "Edit Task" : "Create New Task"}
              </h3>

              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-slate-400 text-2xl"
              >
                ×
              </button>
            </div>

            <label className="text-sm font-semibold">Task Title</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter task title"
              className="w-full border rounded-xl p-3 mt-2 mb-4 outline-none focus:ring-2 focus:ring-violet-300"
            />

            <label className="text-sm font-semibold">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Enter task description"
              className="w-full border rounded-xl p-3 mt-2 mb-4 outline-none focus:ring-2 focus:ring-violet-300"
              rows="3"
            />

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-semibold">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full border rounded-xl p-3 mt-2"
                >
                  <option>To Do</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border rounded-xl p-3 mt-2"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>

            <label className="text-sm font-semibold">Due Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full border rounded-xl p-3 mt-2 mb-6"
            />

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 border rounded-xl py-3 font-semibold"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 bg-violet-600 text-white rounded-xl py-3 font-semibold hover:bg-violet-700"
              >
                {editingId !== null ? "Update Task" : "Create Task"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, number, icon, color }) {
  const colors = {
    violet: "bg-violet-100 text-violet-700",
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h3 className="text-4xl font-bold mt-4 text-slate-800">
            {number}
          </h3>
        </div>

        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colors[color]}`}>
          {icon}
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Your task overview
        </p>
      </div>

    </div>
  );
}