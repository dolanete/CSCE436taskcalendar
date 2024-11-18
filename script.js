// script.js
let selectedTask = null;

function addTask(dayId) {
    const taskDescription = prompt("Enter the task:");
    if (taskDescription) {
        const dayColumn = document.getElementById(dayId);
        const taskList = dayColumn.querySelector(".task-list");

        const taskItem = document.createElement("div");
        taskItem.className = "task-item";
        taskItem.textContent = taskDescription;

        // Select task on click
        taskItem.onclick = () => {
            if (selectedTask) {
                selectedTask.classList.remove("selected-task");
            }
            selectedTask = taskItem;
            taskItem.classList.add("selected-task");
        };

        taskList.appendChild(taskItem);
    }
}

function removeTask() {
    if (selectedTask) {
        selectedTask.remove();
        selectedTask = null;
    } else {
        alert("No task selected!");
    }
}

function moveTaskUp() {
    if (selectedTask) {
        const prevTask = selectedTask.previousElementSibling;
        if (prevTask) {
            selectedTask.parentNode.insertBefore(selectedTask, prevTask); // Move the task up
        } 
    } else {
        alert("No task selected!");
    }
}

function moveTaskDown() {
    if (selectedTask) {
        const nextTask = selectedTask.nextElementSibling;
        if (nextTask) {
            selectedTask.parentNode.insertBefore(nextTask, selectedTask); // Move the task down
        } 
    } else {
        alert("No task selected!");
    }
}
