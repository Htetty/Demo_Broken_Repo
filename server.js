import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let nextTaskId = 1;
const tasks = [];

app.get("/tasks", (req, res) => {
  const status = req.query.status ?? "all";
  let visibleTasks = tasks;

  if (status === "active") {
    visibleTasks = tasks.filter((task) => task.completed !== true);
  } else if (status === "completed") {
    visibleTasks = tasks.filter((task) => task.completed === true);
  }

  res.json({ tasks: visibleTasks, count: visibleTasks.length });
});

app.post("/tasks", (req, res) => {
  const { title, priority, dueDate } = req.body;

  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ error: "A task title is required." });
  }

  if (!["low", "medium", "high"].includes(priority)) {
    return res.status(400).json({ error: "Priority must be low, medium, or high." });
  }

  if (typeof dueDate !== "string" || dueDate === "") {
    return res.status(400).json({ error: "A due date is required." });
  }

  const task = {
    id: nextTaskId++,
    title: title.trim(),
    priority,
    dueDate,
    completed: false,
    state: "active",
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  return res.status(201).json({ task });
});

app.patch("/tasks/:id/complete", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  task.completed = true;
  return res.json({ success: true, task });
});

app.listen(PORT, () => {
  console.log(`Taskboard running on http://localhost:${PORT}`);
});