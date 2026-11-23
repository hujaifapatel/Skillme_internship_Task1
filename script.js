// ---------------------------------------------------------------
// Kanso - Week 2
// The `tasks` array is the single source of truth.
// We never edit cards directly: change the array, then call render().
// ---------------------------------------------------------------

// The order of the columns. Moving a task = changing its index here.
const STATUSES = ["todo", "doing", "done"];

let tasks = [
  { id: 1, title: "Draw the three onboarding illustrations", priority: "high", status: "todo", tag: "Design", due: "2026-11-27" },
  { id: 2, title: "Document the v2 API endpoints", priority: "medium", status: "todo", tag: "Docs", due: "2026-11-30" },
  { id: 3, title: "Check colour contrast on every screen", priority: "low", status: "todo", tag: "Accessibility", due: "2026-12-02" },
  { id: 4, title: "Build the mobile navigation menu", priority: "high", status: "doing", tag: "Frontend", due: "2026-11-24" },
  { id: 5, title: "Run lint and tests on every pull request", priority: "medium", status: "doing", tag: "DevOps", due: "2026-11-28" },
  { id: 6, title: "Wireframe the board in Figma", priority: "high", status: "done", tag: "UX", due: "2026-11-14" },
  { id: 7, title: "Compare four existing Kanban tools", priority: "low", status: "done", tag: "Research", due: "2026-11-12" },
];

// Elements we use a lot
const board = document.querySelector(".board");
const form = document.getElementById("add-task-form");
const titleInput = document.getElementById("task-title");
const priorityInput = document.getElementById("task-priority");
const dateInput = document.getElementById("task-date");
const formError = document.getElementById("form-error");

// Which task (if any) is being edited right now
let editingId = null;

// ---------- Helpers ----------

// Stop user text from being read as HTML
function escapeHTML(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// "2026-11-27" -> "Due Fri 27 Nov" (or "Due today" / "Due tomorrow")
function formatDue(task) {
  if (!task.due) return { text: "No due date", soon: false };

  const due = new Date(task.due + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysLeft = Math.round((due - today) / 86400000);

  const pretty = due.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" }).replace(",", "");

  if (task.status === "done") return { text: "Due " + pretty, soon: false };
  if (daysLeft < 0) return { text: "Overdue " + pretty, soon: true };
  if (daysLeft === 0) return { text: "Due today", soon: true };
  if (daysLeft === 1) return { text: "Due tomorrow", soon: true };
  return { text: "Due " + pretty, soon: false };
}

// ---------- Rendering ----------

function createCardHTML(task) {
  const index = STATUSES.indexOf(task.status);
  const due = formatDue(task);
  const finished = task.status === "done" ? " finished" : "";

  const title =
    task.id === editingId
      ? `<input class="edit-input" type="text" value="${escapeHTML(task.title)}" maxlength="120" aria-label="Edit task title">`
      : `<h3 class="task-title" title="Double-click to edit">${escapeHTML(task.title)}</h3>`;

  return `
    <div class="task-card${finished}" data-id="${task.id}">
      <div class="card-top">
        <span class="priority priority-${task.priority}">${capitalize(task.priority)}</span>
        ${task.tag ? `<span class="tag">${escapeHTML(task.tag)}</span>` : ""}
      </div>
      ${title}
      <div class="card-bottom">
        <span class="due-date${due.soon ? " soon" : ""}">${due.text}</span>
        <div class="card-actions">
          <button type="button" class="icon-btn" data-action="left" data-id="${task.id}"
            aria-label="Move left" title="Move left" ${index === 0 ? "disabled" : ""}>&larr;</button>
          <button type="button" class="icon-btn" data-action="right" data-id="${task.id}"
            aria-label="Move right" title="Move right" ${index === STATUSES.length - 1 ? "disabled" : ""}>&rarr;</button>
          <button type="button" class="icon-btn delete" data-action="delete" data-id="${task.id}"
            aria-label="Delete task" title="Delete">&times;</button>
        </div>
      </div>
    </div>`;
}

function render() {
  const counts = {};

  STATUSES.forEach((status) => {
    const column = board.querySelector(`.column[data-status="${status}"]`);
    const list = column.querySelector(".task-list");
    const columnTasks = tasks.filter((task) => task.status === status);

    // 1. Clear the column, 2. add a card for every matching task
    list.innerHTML = columnTasks.map(createCardHTML).join("");

    // 3. Update the count so it always matches the data
    column.querySelector(".task-count").textContent = `(${columnTasks.length})`;
    counts[status] = columnTasks.length;
  });

  renderSummary(counts);

  // If a title is being edited, put the cursor in the box
  const editInput = board.querySelector(".edit-input");
  if (editInput) {
    editInput.focus();
    editInput.select();
  }
}

function renderSummary(counts) {
  document.getElementById("done-summary").textContent = `${counts.done} of ${tasks.length}`;
  document.getElementById("sum-todo").textContent = counts.todo;
  document.getElementById("sum-doing").textContent = counts.doing;
  document.getElementById("sum-done").textContent = counts.done;

  document.querySelector(".bar-todo").style.flex = counts.todo;
  document.querySelector(".bar-progress").style.flex = counts.doing;
  document.querySelector(".bar-done").style.flex = counts.done;
}

// ---------- Adding a task ----------

form.addEventListener("submit", (event) => {
  event.preventDefault(); // no page reload

  const title = titleInput.value.trim();
  if (title === "") {
    formError.textContent = "Please enter a task title.";
    titleInput.classList.add("invalid");
    titleInput.focus();
    return;
  }

  tasks.push({
    id: Date.now(),
    title: title,
    priority: priorityInput.value,
    status: "todo",
    due: dateInput.value,
  });

  form.reset();
  render();
  titleInput.focus();
});

// Clear the error as soon as the user starts typing
titleInput.addEventListener("input", () => {
  formError.textContent = "";
  titleInput.classList.remove("invalid");
});

// ---------- Moving and deleting (event delegation) ----------

// One listener on the whole board handles every card button,
// even the ones that are created later by render().
board.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const id = Number(button.dataset.id);
  const task = tasks.find((t) => t.id === id);
  if (!task) return;

  const action = button.dataset.action;

  if (action === "left" || action === "right") {
    const index = STATUSES.indexOf(task.status);
    const newIndex = action === "left" ? index - 1 : index + 1;
    if (newIndex >= 0 && newIndex < STATUSES.length) {
      task.status = STATUSES[newIndex];
      render();
    }
  }

  if (action === "delete") {
    if (confirm(`Delete "${task.title}"?`)) {
      tasks = tasks.filter((t) => t.id !== id);
      render();
    }
  }
});

// ---------- Stretch goal: double-click a title to edit it ----------

board.addEventListener("dblclick", (event) => {
  const titleEl = event.target.closest(".task-title");
  if (!titleEl) return;

  editingId = Number(titleEl.closest(".task-card").dataset.id);
  render();
});

function finishEditing(save) {
  if (editingId === null) return;

  const input = board.querySelector(".edit-input");
  const task = tasks.find((t) => t.id === editingId);
  const newTitle = input ? input.value.trim() : "";

  // An empty title is not allowed, so we just keep the old one
  if (save && task && newTitle !== "") {
    task.title = newTitle;
  }

  editingId = null;
  render();
}

board.addEventListener("keydown", (event) => {
  if (!event.target.classList.contains("edit-input")) return;
  if (event.key === "Enter") finishEditing(true);
  if (event.key === "Escape") finishEditing(false);
});

// Clicking somewhere else also saves
board.addEventListener("focusout", (event) => {
  if (event.target.classList.contains("edit-input")) finishEditing(true);
});

// Draw the board for the first time
render();
