import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

const users = [
  { email: "demo@example.com", password: "password123", name: "Demo User" }
];

app.get("/", (req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Broken Login Demo</title>
    <style>
      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        background: #f4f7fb;
        color: #172033;
      }

      main {
        width: min(420px, calc(100vw - 32px));
        padding: 28px;
        border: 1px solid #d7deea;
        border-radius: 8px;
        background: #ffffff;
        box-shadow: 0 16px 36px rgba(18, 32, 56, 0.08);
      }

      h1 {
        margin: 0 0 8px;
        font-size: 1.5rem;
      }

      p {
        margin: 0 0 20px;
        color: #5b667a;
      }

      label {
        display: grid;
        gap: 6px;
        margin-bottom: 14px;
        font-weight: 600;
      }

      input {
        width: 100%;
        border: 1px solid #b9c4d6;
        border-radius: 6px;
        padding: 10px 12px;
        font: inherit;
      }

      button {
        width: 100%;
        border: 0;
        border-radius: 6px;
        padding: 11px 14px;
        font: inherit;
        font-weight: 700;
        color: #ffffff;
        background: #2463eb;
        cursor: pointer;
      }

      button:disabled {
        cursor: wait;
        opacity: 0.7;
      }

      #message {
        min-height: 24px;
        margin-top: 16px;
        font-weight: 700;
      }

      #message.success {
        color: #137333;
      }

      #message.error {
        color: #b3261e;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Broken Login Demo</h1>
      <p>Use demo@example.com with password123 for a successful login.</p>

      <form id="login-form">
        <label>
          Email
          <input id="email" name="email" type="email" autocomplete="email" required>
        </label>

        <label>
          Password
          <input id="password" name="password" type="password" autocomplete="current-password" required>
        </label>

        <button id="login-button" type="submit">Log in</button>
      </form>

      <div id="message" role="status" aria-live="polite"></div>
    </main>

    <script>
      const form = document.querySelector("#login-form");
      const button = document.querySelector("#login-button");
      const message = document.querySelector("#message");

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        button.disabled = true;
        message.className = "";
        message.textContent = "Signing in...";

        const formData = new FormData(form);
        const payload = {
          email: formData.get("email"),
          password: formData.get("password")
        };

        try {
          const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });

          const data = await response.json();

          if (response.ok) {
            message.className = "success";
            message.textContent = data.message;
          } else {
            message.className = "error";
            message.textContent = data.error || "Login failed";
          }
        } catch (error) {
          message.className = "error";
          message.textContent = "Login request failed";
        } finally {
          button.disabled = false;
        }
      });
    </script>
  </body>
</html>`);
});

app.post("/login", (req, res) => {
  const user = users.find((u) => u.email === req.body.email);

  if (user && user.password === req.body.password) {
    res.json({ success: true, message: `Welcome back, ${user.name}!` });
  } else {
    res.status(401).json({ error: "Invalid login" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});