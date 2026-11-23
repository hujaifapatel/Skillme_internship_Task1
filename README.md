# Kanso - Kanban Board

My Kanban board for the SkillMe internship. Week 1 was the layout in HTML and CSS. In Week 2 I added JavaScript so you can add tasks, move them between columns, delete them and edit their titles.

**Live demo:** https://hujaifapatel.github.io/Skillme_internship_Task1/

Made by Hujaifa Patel.

## Week 1 - Layout

### What I had to do

1. Create `index.html`, `style.css` and `script.js`, then `git init` and commit
2. Add a header with the app name and an "Add task" form (text input, priority select and a button)
3. Make three columns: To Do, In Progress and Done, each with a heading and a task count like (3)
4. Add 5-6 sample task cards with a title, priority and due date
5. Put the columns side by side using CSS Grid or Flexbox
6. Give the priority labels different colours using CSS variables
7. Check the layout in the browser and commit

Stretch goal: stack the columns on screens smaller than 700px.

### What I did

- The board uses `grid-template-columns: repeat(3, 1fr)` so the three columns sit side by side
- There are 7 task cards and all of them use the same `.task-card` class
- Priority colours come from `--priority-high`, `--priority-medium` and `--priority-low`. High is a filled label, Medium is a light background and Low is just an outline, so they look different even without colour
- Each column has a `min-height` and a "Drop tasks here" box, so it still looks like a drop area when it's empty
- No inline styles
- Below 700px the columns stack into one and the form fits the phone screen
- Extra: a dark mode button that works without JavaScript (a hidden checkbox and the CSS `:has()` selector)
- Extra: a small sprint summary showing 2 of 7 tasks done

## Week 2 - Making it work with JavaScript

### What I had to do

1. Remove the hard-coded cards and keep the tasks in a `tasks` array in `script.js`
2. Write a `render()` function that clears each column and draws a card for every task with that status
3. Update the column counts inside `render()`
4. Handle the add-task form: no page reload, ignore empty titles, add the task to To Do
5. Add buttons on each card to move it left or right, and a delete button that asks `confirm()` first
6. Use one click listener on the board with `event.target` and `data-id` (event delegation)
7. Test everything and commit

Stretch goal: edit a task title by double-clicking it.

### What I did

- The `tasks` array (objects like `{ id, title, priority, status }`) is the only source of truth. Buttons never touch the cards directly - they change the array and call `render()`
- The column order lives in `const STATUSES = ["todo", "doing", "done"]`, so moving a task is just changing its index by 1
- New tasks get `Date.now()` as their id and always start in To Do
- Empty or spaces-only titles are rejected with a small error message under the form
- The left arrow is disabled in To Do and the right arrow is disabled in Done
- Delete asks for confirmation with `confirm()`
- One `click` listener on `.board` handles every card button using `event.target.closest()` and `button.dataset.id`
- Column counts and the sprint summary (done count, bar and totals) are all calculated in `render()` so they always match the board
- Titles are escaped before they go into the HTML, so typing `<b>` shows as text
- Stretch goal: double-click a title to edit it. Enter or clicking away saves, Escape cancels
- Due dates show "Due today", "Due tomorrow" or "Overdue" when it makes sense

## How to run

Download or clone the repo and open `index.html` in your browser.

```
git clone https://github.com/hujaifapatel/Skillme_internship_task1.git
```
