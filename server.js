import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
  { email: "test@example.com", password: "password123" }
];

app.get("/", (req, res) => {
  res.send("Demo Broken Repo is running");
});

app.post("/login", (req, res) => {
  const user = users.find((u) => u.email === req.body.email);

  // keep this bug on purpose for Playwright/testing later
  if (user.password === req.body.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
