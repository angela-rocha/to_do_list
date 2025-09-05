    const taskInput = document.getElementById("taskInput");
    const addTaskBtn = document.getElementById("addTask");
    const taskList = document.getElementById("taskList");
    const categorySelect = document.getElementById("categorySelect");
    const filterCategory = document.getElementById("filterCategory");
    const filterStatus = document.getElementById("filterStatus");

    // Carregar tarefas do localStorage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    function renderTasks() {
      taskList.innerHTML = "";
      const categoryFilter = filterCategory.value;
      const statusFilter = filterStatus.value;

      tasks.forEach((task, index) => {
        // Filtro por categoria
        if (categoryFilter !== "Todas" && task.category !== categoryFilter) return;

        // Filtro por status
        if (statusFilter === "Pendentes" && task.completed) return;
        if (statusFilter === "Concluídas" && !task.completed) return;

        const li = document.createElement("li");

        if (task.completed) {
          li.classList.add("completed");
        }

        const taskInfo = document.createElement("div");
        taskInfo.classList.add("task-info");
        taskInfo.textContent = task.text;

        const categorySpan = document.createElement("span");
        categorySpan.textContent = task.category;
        categorySpan.classList.add("category", task.category);

        taskInfo.appendChild(categorySpan);
        li.appendChild(taskInfo);

        // Marcar como concluído ao clicar
        li.addEventListener("click", () => {
          tasks[index].completed = !tasks[index].completed;
          saveTasks();
          renderTasks();
        });

        // Botão de excluir
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete");
        deleteBtn.addEventListener("click", (e) => {
          e.stopPropagation(); // evitar marcar como concluído
          tasks.splice(index, 1);
          saveTasks();
          renderTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
      });
    }

    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    addTaskBtn.addEventListener("click", () => {
      const text = taskInput.value.trim();
      const category = categorySelect.value;
      if (text !== "") {
        tasks.push({ text, category, completed: false });
        saveTasks();
        renderTasks();
        taskInput.value = "";
      }
    });

    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addTaskBtn.click();
      }
    });

    filterCategory.addEventListener("change", renderTasks);
    filterStatus.addEventListener("change", renderTasks);

    // Renderizar ao carregar
    renderTasks();
