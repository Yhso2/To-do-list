// Global tasks array
let tasks = [];

const img1 = new Image();
img1.src = 'public/profile.jpg';

const img2 = new Image();
img2.src = 'public/profile2.jpg';


/**
 * Load tasks from localStorage when page loads
 */
function loadTasks() {
    const savedTasks = localStorage.getItem('todoTasks');
    if (savedTasks) {
        tasks = JSON.parse(savedTasks);
    }
    renderTasks();
}

/**
 * Save tasks to localStorage
 */
function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

/**
 * Update profile image based on task count
 */function updateProfileImage() {
    const profileImage = document.getElementById('profileImage');
    
    if (tasks.length === 0) {
        // No tasks at all
        profileImage.src = 'public/profile.jpg';
    } else {
        const completedCount = tasks.filter(t => t.completed).length;
        
        if (completedCount === tasks.length) {
            // All tasks completed
            profileImage.src = 'public/profile3.jpg'; // 👈 Add this image!
        } else {
            // Some tasks still pending
            profileImage.src = 'public/profile2.jpg';
        }
    }
}

/**
 * Add a new task to the list
 */
function addTask() {
    const input = document.getElementById('taskInput');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
}

/**
 * Toggle task completion status
 * @param {number} id - The task ID to toggle
 */
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

/**
 * Delete a task from the list
 * @param {number} id - The task ID to delete
 */
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
}

/**
 * Render all tasks to the DOM
 */
function renderTasks() {
    const taskList = document.getElementById('taskList');
    const stats = document.getElementById('stats');

    // Update profile image based on task count
    updateProfileImage();

    if (tasks.length === 0) {
        taskList.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        stats.innerHTML = '';
        return;
    }

    taskList.innerHTML = tasks.map(task => `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
            >
            <span class="task-text">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </li>
    `).join('');

    const completedCount = tasks.filter(t => t.completed).length;
    stats.innerHTML = `${completedCount} of ${tasks.length} tasks completed`;
}

// Load tasks when page loads
loadTasks();