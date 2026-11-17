const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed:", err);
    return;
  }
  console.log("MySQL Connected Successfully!");
});

app.get("/", (req, res) => {
  res.send("Task Flow Backend is Working!");
});

app.get("/api/tasks", (req, res) => {
  db.query("SELECT * FROM tasks", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

app.post("/api/tasks", (req, res) => {
  const { title, description, status, priority } = req.body;

  const sql = `INSERT INTO tasks (title, description, status, priority)
               VALUES (?, ?, ?, ?)`;

  db.query(sql, [title, description, status, priority], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      message: "Task added successfully!",
      id: result.insertId
    });
  });
});
app.put("/api/tasks/:id", (req, res) => {

  console.log("Put Request Received");
  const { title, description, status, priority } = req.body;
  const { id } = req.params;

  const sql = `UPDATE tasks
               SET title = ?, description = ?, status = ?, priority = ?
               WHERE id = ?`;

  db.query(sql, [title, description, status, priority, id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task updated successfully!" });
  });
  });

  app.delete("/api/tasks/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM tasks WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully!"
    });
  });
});
app.use((req, res) => {
  console.log("UNMATCHED REQUEST:", req.method, req.originalUrl);

  res.status(404).json({
    message: "Route not found"
  });
});
app.listen(5001, () => {
  console.log("Server running on port 5001");
});