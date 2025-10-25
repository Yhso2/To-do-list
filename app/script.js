// Preload images to prevent flicker
const img1 = new Image();
img1.src = 'public/profile.jpg';

const img2 = new Image();
img2.src = 'public/profile2.jpg';

const img3 = new Image();
img3.src = 'public/profile3.jpg';

// Global tasks array
let tasks = [];

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
 * Update profile image based on task count and completion status
 */
function updateProfileImage() {
    const profileImage = document.getElementById('profileImage');
    
    if (tasks.length === 0) {
        // No tasks at all
        profileImage.src = 'public/profile.jpg';
    } else {
        const completedCount = tasks.filter(t => t.completed).length;
        
        if (completedCount === tasks.length) {
            // All tasks completed → show profile3.jpg AND trigger confetti!
            profileImage.src = 'public/profile3.jpg';
            startConfetti(); // 🎉 Trigger confetti!
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

    // Update profile image based on task state
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

// 🔥 CONFETTI ANIMATION (Simple & Lightweight)
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const confettiCount = 150;
    const confettiColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    const confetti = [];
    for (let i = 0; i < confettiCount; i++) {
        confetti.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
            speed: Math.random() * 3 + 2,
            angle: Math.random() * 2 * Math.PI,
            rotation: Math.random() * 2 * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach(p => {
            p.y += p.speed;
            p.rotation += p.rotationSpeed;
            
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();

            if (p.y > canvas.height) {
                p.y = -p.size;
                p.x = Math.random() * canvas.width;
            }
        });

        requestAnimationFrame(animate);
    }

    animate();

    // Stop confetti after 5 seconds
    setTimeout(() => {
        canvas.style.display = 'none';
        // Optional: reset canvas for next time
        confetti.length = 0;
    }, 5000);
}

// Load tasks when page loads
loadTasks();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});