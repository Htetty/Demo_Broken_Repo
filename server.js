app.post("/login", (req, res) => {
  const user = users.find((u) => u.email === req.body.email);
  
  if (user.password === req.body.password) {
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid login" });
  }
});
