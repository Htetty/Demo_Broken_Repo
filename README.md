# Broken Login Demo

This is a deliberately broken Node/Express web app for testing bug-fixing agents and Playwright-based debugging pipelines.

## Run

```bash
npm install
npm start
```

The app starts at:

```text
http://localhost:3000
```

## Valid Test Login

- Email: `demo@example.com`
- Password: `password123`

## Reproduce the Bug

1. Start the app with `npm start`.
2. Open `http://localhost:3000` in a browser.
3. Enter an email that does not exist, such as `missing@example.com`.
4. Enter any password.
5. Click `Log in`.

Expected behavior for a normal app: the page should show a clean invalid-login message.

Actual behavior in this intentionally broken demo: `POST /login` returns HTTP 500 because the server tries to read `user.password` when `user` is `undefined`.

The bug is in `server.js`:

```js
const user = users.find((u) => u.email === req.body.email);

if (user.password === req.body.password) {
  res.json({ success: true, message: `Welcome back, ${user.name}!` });
}
```

Do not fix this bug unless you are testing a repair workflow.
