import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [page, setPage] = useState(1);

  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const tasksPerPage = 5;

  const [form, setForm] = useState({
    title: "",
    description: "",
    assignedTo: "",
  });

  /* FETCH */
  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/api/tasks", {
      headers: { authorization: token },
    });
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

 //CREATE 
  const createTask = async (e) => {
    if (e) e.preventDefault(); 

    try {
      await axios.post(
        "http://localhost:5000/api/tasks",
        form,
        { headers: { authorization: token } }
      );

      setShowForm(false);
      setForm({ title: "", description: "", assignedTo: "" });

      fetchTasks();
    } catch (err) {
      console.log(err);
    }
  };

  // DELETE
  const deleteTask = async (id) => {
    if (!window.confirm("Delete task?")) return;

    await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
      headers: { authorization: token },
    });

    fetchTasks();
  };

  /* UPDATE  */
  const updateStatus = async (status) => {
    await axios.put(
      `http://localhost:5000/api/tasks/${selectedTask.id}`,
      { status },
      { headers: { authorization: token } }
    );

    setSelectedTask(null);
    fetchTasks();
  };

  /*  LOGOUT  */
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* FILTER + SEARCH  */
  const filtered = tasks.filter((t) => {
    const s = search.toLowerCase();

    const matchSearch =
      t.title.toLowerCase().includes(s) ||
      t.assignedTo.toLowerCase().includes(s);

    const matchFilter =
      filter === "All" ? true : t.status === filter;

    return matchSearch && matchFilter;
  });

  /*  PAGINATION  */
  const indexLast = page * tasksPerPage;
  const indexFirst = indexLast - tasksPerPage;

  const currentTasks = filtered.slice(indexFirst, indexLast);
  const totalPages = Math.ceil(filtered.length / tasksPerPage);

 // STATS 
  const total = tasks.length;
  const pending = tasks.filter(t => t.status === "Pending").length;
  const progress = tasks.filter(t => t.status === "In Progress").length;
  const completed = tasks.filter(t => t.status === "Completed").length;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "—";

//UI 
  return (
    <div className="layout">

      
      <div className="sidebar">
        <h2>Task Manager</h2>
        <p className="active">Dashboard</p>
      </div>

   
      <div className="main">

       
        <div className="top-bar">
          <h2>Dashboard</h2>

          <div className="top-actions">

            <button className="logout-btn" onClick={logout}>
              Logout
            </button>

            <input
              placeholder="Search..."
              onChange={(e) => setSearch(e.target.value)}
            />

            <select onChange={(e) => setFilter(e.target.value)}>
              <option>All</option>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <button
              className="create-btn"
              onClick={() => setShowForm(true)}
            >
              + Create Task
            </button>

          </div>
        </div>

        {/* CARDS */}
        <div className="cards">
          <Card title="Total" value={total} color="blue" />
          <Card title="Pending" value={pending} color="yellow" />
          <Card title="Progress" value={progress} color="purple" />
          <Card title="Completed" value={completed} color="green" />
        </div>

        {/* TABLE */}
        <div className="table-box">
          <table>
            <thead>
              <tr>
                <th>Assigned</th>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {currentTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.assignedTo}</td>
                  <td>{task.title}</td>

                  <td>
                    <span className={`badge ${task.status.replace(" ", "")}`}>
                      {task.status}
                    </span>
                  </td>

                  <td>{formatDate(task.createdAt)}</td>

                  <td>
                    <button className="view-btn" onClick={() => setSelectedTask(task)}>View</button>
                       &nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="pagination">
            <button className="prev" disabled={page === 1} onClick={() => setPage(page - 1)}>
              Prev
            </button>

            Page {page}/{totalPages || 1}

            <button className="prev" disabled={page === totalPages} onClick={() => setPage(page + 1)}>
              Next
            </button>
          </div>
        </div>

        {/* CREATE  */}
        {showForm && (
  <div className="modal">
    <div className="modal-box">
      <h3>Create Task</h3>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          createTask();   // 
        }}
      >

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm({ ...form, title: e.target.value })
          }
          required
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
          required
        />

        <input
          placeholder="Assign Email"
          value={form.assignedTo}
          onChange={(e) =>
            setForm({ ...form, assignedTo: e.target.value })
          }
          required
        />

        <div className="modal-actions">
          <button
            type="button"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>

        
          <button
            type="submit"
            className="create-btn"
          >
            Create
          </button>
        </div>

      </form>
    </div>
  </div>
)}


        {/*  VIEW/UPDATE MODAL */}
        {selectedTask && (
          <div className="modal">
            <div className="modal-box">

              <h3>{selectedTask.title}</h3>

              <select
                defaultValue={selectedTask.status}
                onChange={(e) => updateStatus(e.target.value)}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <button className="close-btn" onClick={() => setSelectedTask(null)}>
                Close
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* CARD */
function Card({ title, value, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <h4>{title}</h4>
      <h1>{value}</h1>
    </div>
  );
}
