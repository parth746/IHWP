document.addEventListener("DOMContentLoaded", () => {
  loadTasks();

  const addTaskBtn = document.getElementById("addTaskBtn");
  const filterButtons = document.querySelectorAll(".filter-btn");

  addTaskBtn.addEventListener("click", addTask);
  filterButtons.forEach(btn =>
    btn.addEventListener("click", () => filterTasks(btn))
  );
});

function addTask() {
  const taskInput = document.getElementById("taskInput");
  const dueDate = document.getElementById("dueDate");
  const taskText = taskInput.value.trim();
  const due = dueDate.value;

  if (taskText === "") {
    alert("Please enter a task!");
    return;
  }

  const task = { text: taskText, due: due, completed: false };
  const tasks = getTasks();
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  dueDate.value = "";
  renderTasks(tasks);
}

function getTasks() {
  return JSON.parse(localStorage.getItem("tasks")) || [];
}

function loadTasks() {
  const tasks = getTasks();
  renderTasks(tasks);
}

function renderTasks(tasks) {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    const infoDiv = document.createElement("div");
    infoDiv.classList.add("task-info");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;

    if (task.completed) taskText.classList.add("completed");

    const dueDate = document.createElement("small");
    dueDate.textContent = task.due ? `Due: ${task.due}` : "No due date";

    infoDiv.appendChild(taskText);
    infoDiv.appendChild(dueDate);

    li.appendChild(infoDiv);

    li.addEventListener("click", () => {
      task.completed = !task.completed;
      saveTasks(tasks);
      renderTasks(tasks);
    });

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.classList.add("delete");
    delBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      tasks.splice(index, 1);
      saveTasks(tasks);
      renderTasks(tasks);
    });

    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks(btn) {
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");

  const filterType = btn.dataset.filter;
  const tasks = getTasks();

  let filtered = tasks;
  if (filterType === "pending") filtered = tasks.filter(t => !t.completed);
  else if (filterType === "completed") filtered = tasks.filter(t => t.completed);

  renderTasks(filtered);
}
