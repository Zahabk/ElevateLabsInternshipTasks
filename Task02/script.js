document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.getElementById("add-btn");
  const taskInput = document.getElementById("task-input");
  const taskList = document.getElementById("task-list");

  //load tasks from local storage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((task) => addTask(task.text, task.completed));

  addBtn.addEventListener("click", () => {
    const taskText = taskInput.value.trim();
    if (taskText !== "") {
      addTask(taskText, false);
      tasks.push({ text: taskText, completed: false });
      localStorage.setItem("tasks", JSON.stringify(tasks));
      taskInput.value = "";
      taskInput.focus();
    }
  });

  taskInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      const taskText = taskInput.value.trim();
      if (taskText !== "") {
        addTask(taskText, false);
        tasks.push({ text: taskText, completed: false });
        localStorage.setItem("tasks", JSON.stringify(tasks));
        taskInput.value = "";
        taskInput.focus();
      }
    }
  });

  function addTask(taskText, completed) {
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `<span class="task-text ${
      completed ? "completed" : ""
    }">${taskText}</span>
    <div class="btn-section">
    <button class="mark-btn">✅Mark Complete</button>
    <button class="remove-btn">🗑️Delete</button>
    </div>`;

    //remove task
    li.querySelector(".remove-btn").addEventListener("click", () => {
      const index = [...taskList.children].indexOf(li);
      tasks.splice(index, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));

      taskList.removeChild(li);
    });

    //mark as completed
    li.querySelector(".mark-btn").addEventListener("click", () => {
      const taskText = li.querySelector(".task-text");
      taskText.classList.toggle("completed");
      //update in local storage
      const index = [...taskList.children].indexOf(li);
      tasks[index].completed = taskText.classList.contains("completed");
      localStorage.setItem("tasks", JSON.stringify(tasks));

      const markBtn = li.querySelector(".mark-btn");
      markBtn.style.backgroundColor = "#d4edda";
      markBtn.style.color = "#404140ff";
    });

    taskList.appendChild(li);
  }
});
