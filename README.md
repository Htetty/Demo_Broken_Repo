# Broken Taskboard Demo

A deliberately broken Express and vanilla JavaScript task manager for testing autonomous browser-based bug reproduction and repair workflows.

Tasks are held in server memory and reset whenever the server restarts.

## Run

```bash
npm install
npm start
```

Open `http://localhost:3000`.

## Expected Behavior

After a task is marked complete, selecting the **Active** filter should hide that task. The visible-task count should only include active tasks.

## Actual Broken Behavior

The completion request succeeds and the task is visually marked complete. After switching to the **Active** filter, however, the completed task remains visible and the count incorrectly includes it.

The intentional defect is in the backend filtering logic for `GET /tasks?status=active`. The completion endpoint updates the canonical `completed` property, while the Active filter incorrectly checks an obsolete `state` property.

## Reproduction Steps

1. Start the app and open `http://localhost:3000`.
2. Enter a title, choose a priority and due date, then click **Add task**.
3. Click **Mark complete** on the new task.
4. Confirm that the row receives completed styling and the button changes to **Completed**.
5. Click **Active**.
6. Observe that the completed task still appears and `#visible-count` reports the wrong count.

For comparison, the **Completed** filter correctly shows completed tasks.

## Useful Routes

- `GET /tasks?status=all`
- `GET /tasks?status=active`
- `GET /tasks?status=completed`
- `POST /tasks`
- `PATCH /tasks/:id/complete`

This repository intentionally contains a bug. Do not correct it when preparing the reproduction fixture.
