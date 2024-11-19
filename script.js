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

    const dayColumn = document.getElementById(dayId);
    const taskList = dayColumn.querySelector(".task-list");

    const taskItem = document.createElement("div");
    taskItem.className = "task-item";
    taskItem.textContent = `${taskTime} - ${taskDescription}`;
    taskItem.dataset.time = taskTime; // Store time for sorting

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
