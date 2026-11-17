# Kanso - Kanban Board

My Week 1 task for the SkillMe internship. It's the static layout of a Kanban board made with HTML and CSS. JavaScript will be added in Week 2.

## What I had to do

1. Create `index.html`, `style.css` and `script.js`, then `git init` and commit
2. Add a header with the app name and an "Add task" form (text input, priority select and a button)
3. Make three columns: To Do, In Progress and Done, each with a heading and a task count like (3)
4. Add 5-6 sample task cards with a title, priority and due date
5. Put the columns side by side using CSS Grid or Flexbox
6. Give the priority labels different colours using CSS variables
7. Check the layout in the browser and commit

Stretch goal: stack the columns on screens smaller than 700px.

## What I did

- The board uses `grid-template-columns: repeat(3, 1fr)` so the three columns sit side by side
- There are 7 task cards and all of them use the same `.task-card` class
- Priority colours come from `--priority-high`, `--priority-medium` and `--priority-low`. High is a filled label, Medium is a light background and Low is just an outline, so they look different even without colour
- Each column has a `min-height` and a "Drop tasks here" box, so it still looks like a drop area when it's empty
- No inline styles
- Below 700px the columns stack into one and the form fits the phone screen
- Extra: a dark mode button that works without JavaScript (a hidden checkbox and the CSS `:has()` selector)
- Extra: a small sprint summary showing 2 of 7 tasks done

## How to run

Download or clone the repo and open `index.html` in your browser.

```
git clone https://github.com/hujaifapatel/Skillme_internship_task1.git
```
