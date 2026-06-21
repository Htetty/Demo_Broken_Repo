import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

let nextTaskId = 1;
const tasks = [];
const taskListCache = new Map();
const CACHE_TTL_MS = 60_000;

function statusFor(task) {
  return task.completed ? "completed" : "active";
}

function cacheKey(status) {
  return `task-list:${status}`;
}

function readTaskList(status) {
  const entry = taskListCache.get(cacheKey(status));

  if (!entry || entry.expiresAt <= Date.now()) {
    return null;
  }

  return entry.payload;
}

function writeTaskList(status, payload) {
  taskListCache.set(cacheKey(status), {
    payload: structuredClone(payload),
    expiresAt: Date.now() + CACHE_TTL_MS
  });
}

function invalidateTaskLists(statuses) {
  for (const status of statuses) {
    taskListCache.delete(cacheKey(status));
  }
}

app.get("/tasks", (req, res) => {
  const status = req.query.status ?? "all";

  if (!["all", "active", "completed"].includes(status)) {
    return res.status(400).json({ error: "Unknown task status." });
  }

  const cachedPayload = readTaskList(status);

  if (cachedPayload) {
    return res.json(cachedPayload);
  }

  let visibleTasks = tasks;

  if (status === "active") {
    visibleTasks = tasks.filter((task) => task.completed === false);
  } else if (status === "completed") {
    visibleTasks = tasks.filter((task) => task.completed === true);
  }

  const payload = { tasks: visibleTasks, count: visibleTasks.length };
  writeTaskList(status, payload);
  return res.json(payload);
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
    createdAt: new Date().toISOString()
  };

  tasks.push(task);
  invalidateTaskLists(["all", statusFor(task)]);
  return res.status(201).json({ task });
});

app.patch("/tasks/:id/complete", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ error: "Task not found." });
  }

  task.completed = true;
  invalidateTaskLists(["all", statusFor(task)]);
  return res.json({ success: true, task });
});

app.listen(PORT, () => {
  console.log(`Taskboard running on http://localhost:${PORT}`);
});
