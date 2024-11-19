let selectedTask = null; // Track the currently selected task
let fontSize = 16; // Default font size in pixels

function addTask(dayId) {
    const taskDescription = prompt("Enter the task description:");
    if (!taskDescription) return;

    const taskTime = prompt("Enter the task time (HH:MM, 24-hour format):");
    if (!taskTime || !isValidTime(taskTime)) {
        alert("Invalid time format. Please enter a valid time (HH:MM).");
        return;
    }

    const taskContents = prompt("Enter the task contents (optional):") || "";
    const taskLocation = prompt("Enter the task location (optional):") || "";

    const dayColumn = document.getElementById(dayId);
    const taskList = dayColumn.querySelector(".task-list");

    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.textContent = `${taskTime} - ${taskDescription}`;
    taskItem.dataset.time = taskTime; // Store time for sorting
    taskItem.dataset.contents = taskContents; // Store contents
    taskItem.dataset.location = taskLocation; // Store location

    // Show popup on mouseover
    taskItem.onmouseover = (event) => {
        const popup = document.getElementById("task-popup");
        popup.innerHTML = `
            <div class="popup-title">Task Details</div>
            <div><strong>Time:</strong> ${taskItem.dataset.time}</div>
            <div><strong>Description:</strong> ${taskDescription}</div>
            <div><strong>Contents:</strong> ${taskContents || "None"}</div>
            <div><strong>Location:</strong> ${taskLocation || "None"}</div>
        `;
        popup.style.display = "block";
        popup.style.left = `${event.pageX + 10}px`;
        popup.style.top = `${event.pageY + 10}px`;
    };

    // Hide popup on mouseout
    taskItem.onmouseout = () => {
        const popup = document.getElementById("task-popup");
        popup.style.display = "none";
    };

    // Move popup with the mouse
    taskItem.onmousemove = (event) => {
        const popup = document.getElementById("task-popup");
        popup.style.left = `${event.pageX + 10}px`;
        popup.style.top = `${event.pageY + 10}px`;
    };

    // Select task on click
    taskItem.onclick = () => {
        if (selectedTask) {
            selectedTask.classList.remove("selected-task");
        }
        selectedTask = taskItem;
        taskItem.classList.add("selected-task");
    };

    taskList.appendChild(taskItem);
    sortTasks(taskList); // Sort tasks by time
}

function removeTask() {
    if (selectedTask) {
        selectedTask.remove();
        selectedTask = null; // Clear the selected task
    } else {
        alert("No task selected!");
    }
}

function sortTasks(taskList) {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => a.dataset.time.localeCompare(b.dataset.time));
    tasks.forEach(task => taskList.appendChild(task)); // Re-append tasks in order
}

function saveTasks() {
    const tasks = {};
    document.querySelectorAll(".grid-item").forEach(day => {
        const dayId = day.id;
        if (!dayId) return; // Skip headers and non-day items
        const taskList = day.querySelectorAll(".task-item");
        tasks[dayId] = Array.from(taskList).map(task => ({
            description: task.textContent.split(' - ')[1], // Extract description after time
            time: task.dataset.time,
            contents: task.dataset.contents,
            location: task.dataset.location
        }));
    });
    localStorage.setItem("weeklyTasks", JSON.stringify(tasks));
}

function loadTasks() {
    const savedTasks = JSON.parse(localStorage.getItem("weeklyTasks")) || {};
    for (const [dayId, tasks] of Object.entries(savedTasks)) {
        const taskList = document.getElementById(dayId)?.querySelector(".task-list");
        if (!taskList) continue;

        tasks.forEach(({ description, time, contents, location }) => {
            const taskItem = document.createElement("div");
            taskItem.className = "task-item";
            taskItem.textContent = `${time} - ${description}`;
            taskItem.dataset.time = time;
            taskItem.dataset.contents = contents; // Restore contents
            taskItem.dataset.location = location; // Restore location

            taskItem.onclick = () => {
                if (selectedTask) {
                    selectedTask.classList.remove("selected-task");
                }
                selectedTask = taskItem;
                taskItem.classList.add("selected-task");
            };

            taskList.appendChild(taskItem);
        });

        sortTasks(taskList);
    }
}

function isValidTime(time) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Match HH:MM format
    return timeRegex.test(time);
}

function zoomIn() {
    fontSize += 2; // Increase font size
    document.documentElement.style.fontSize = `${fontSize}px`;
}

function zoomOut() {
    if (fontSize > 10) {
        fontSize -= 2; // Decrease font size
        document.documentElement.style.fontSize = `${fontSize}px`;
    } else {
        alert("Minimum font size reached!");
    }
}

window.onload = loadTasks;
window.onbeforeunload = saveTasks;