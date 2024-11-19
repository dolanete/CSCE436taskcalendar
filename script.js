let selectedTask = null; // Track the currently selected task
let fontSize = 16; // Default font size in pixels
let currentWeek = new Date(); // Track the current week

// Helper: Get the start of the week (Sunday)
function getWeekRange(date) {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    return { start };
}

// Helper: Generate a unique key for the current week
function getWeekKey() {
    const { start } = getWeekRange(currentWeek);
    return start.toISOString().split("T")[0]; // Use the week start date as a key
}

// Update the week navigation display
function updateWeekDisplay() {
    const { start } = getWeekRange(currentWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    // Update week navigation display
    const weekDisplay = `${start.toDateString()} - ${end.toDateString()}`;
    document.getElementById("week-display").textContent = weekDisplay;

    // Update dates for each day
    const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const currentDay = new Date(start);

    dayNames.forEach(day => {
        const dateElement = document.getElementById(`${day}-date`);
        if (dateElement) {
            dateElement.textContent = currentDay.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            });
        }
        currentDay.setDate(currentDay.getDate() + 1); // Move to the next day
    });
}


// Change to the previous or next week
function changeWeek(direction) {
    currentWeek.setDate(currentWeek.getDate() + direction * 7); // Move by 7 days
    updateWeekDisplay();
    loadTasks(); // Load tasks for the new week
}

// Add a new task to the selected day
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

    // Add hover functionality
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

    taskItem.onmouseout = () => {
        const popup = document.getElementById("task-popup");
        popup.style.display = "none";
    };

    taskList.appendChild(taskItem);
    sortTasks(taskList); // Sort tasks by time
    saveTasks(); // Save after adding
}

// Remove the currently selected task
function removeTask() {
    if (selectedTask) {
        selectedTask.remove();
        selectedTask = null; // Clear the selected task
        saveTasks(); // Save after removing
    } else {
        alert("No task selected!");
    }
}

// Sort tasks by time
function sortTasks(taskList) {
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => a.dataset.time.localeCompare(b.dataset.time));
    tasks.forEach(task => taskList.appendChild(task)); // Re-append tasks in order
}

// Save tasks for the current week
function saveTasks() {
    const weekKey = getWeekKey();
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

    const allTasks = JSON.parse(localStorage.getItem("weeklyTasks")) || {};
    allTasks[weekKey] = tasks; // Update tasks for the current week
    localStorage.setItem("weeklyTasks", JSON.stringify(allTasks));
}

// Load tasks for the current week
function loadTasks() {
    const weekKey = getWeekKey();
    const allTasks = JSON.parse(localStorage.getItem("weeklyTasks")) || {};
    const tasks = allTasks[weekKey] || {};

    document.querySelectorAll(".grid-item").forEach(day => {
        const dayId = day.id;
        const taskList = day.querySelector(".task-list");

        // Debugging: Log the presence of taskList
        console.log(`Checking day: ${dayId}, taskList exists: ${!!taskList}`);

        // Handle missing taskList elements
        if (!taskList) {
            console.warn(`Task list is missing for day: ${dayId}`);
            return;
        }

        // Clear existing tasks
        taskList.innerHTML = "";

        // Populate tasks for the current day
        if (tasks[dayId]) {
            tasks[dayId].forEach(({ description, time, contents, location }) => {
                const taskItem = document.createElement("div");
                taskItem.className = "task-item";
                taskItem.textContent = `${time} - ${description}`;
                taskItem.dataset.time = time;
                taskItem.dataset.contents = contents; // Restore contents
                taskItem.dataset.location = location; // Restore location

                // Add hover functionality
                taskItem.onmouseover = (event) => {
                    const popup = document.getElementById("task-popup");
                    popup.innerHTML = `
                        <div class="popup-title">Task Details</div>
                        <div><strong>Time:</strong> ${taskItem.dataset.time}</div>
                        <div><strong>Description:</strong> ${description}</div>
                        <div><strong>Contents:</strong> ${contents || "None"}</div>
                        <div><strong>Location:</strong> ${location || "None"}</div>
                    `;
                    popup.style.display = "block";
                    popup.style.left = `${event.pageX + 10}px`;
                    popup.style.top = `${event.pageY + 10}px`;
                };

                taskItem.onmouseout = () => {
                    const popup = document.getElementById("task-popup");
                    popup.style.display = "none";
                };

                taskList.appendChild(taskItem);
            });

            // Sort tasks by time
            sortTasks(taskList);
        }
    });
}

// Helper: Validate time format (HH:MM, 24-hour)
function isValidTime(time) {
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // Match HH:MM format
    return timeRegex.test(time);
}

// Accessibility: Zoom in
function zoomIn() {
    fontSize += 2; // Increase font size
    document.documentElement.style.fontSize = `${fontSize}px`;
}

// Accessibility: Zoom out
function zoomOut() {
    if (fontSize > 10) {
        fontSize -= 2; // Decrease font size
        document.documentElement.style.fontSize = `${fontSize}px`;
    } else {
        alert("Minimum font size reached!");
    }
}

// Initialize on page load
window.onload = () => {
    updateWeekDisplay();
    loadTasks();
};

window.onbeforeunload = saveTasks;