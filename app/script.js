// Preload images
const img1 = new Image(); img1.src = 'public/profile.jpg';
const img2 = new Image(); img2.src = 'public/profile2.jpg';
const img3 = new Image(); img3.src = 'public/profile3.jpg';

let tasks = [];

function loadTasks() {
    const saved = localStorage.getItem('todoTasks');
    tasks = saved ? JSON.parse(saved) : [];
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function updateProfileImage() {
    const img = document.getElementById('profileImage');
    if (tasks.length === 0) {
        img.src = 'public/profile.jpg';
    } else {
        const done = tasks.filter(t => t.completed).length;
        if (done === tasks.length) {
            img.src = 'public/profile3.jpg';
            document.getElementById('confettiCanvas').style.display = 'block';
            startConfetti();
            document.getElementById('resetButton').style.display = 'inline-block'; // 👈 NOW SHOWS!
        } else {
            img.src = 'public/profile2.jpg';
            document.getElementById('resetButton').style.display = 'none';
        }
    }
}

function addTask() {
    const input = document.getElementById('taskInput');
    const text = input.value.trim();
    if (!text) { alert('Please enter a task!'); return; }

    tasks.push({ id: Date.now(), text, completed: false });
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

function resetAllTasks() {
    if (confirm('Clear all tasks? This cannot be undone.')) {
        tasks = [];
        saveTasks();
        renderTasks();
    }
}

function renderTasks() {
    const list = document.getElementById('taskList');
    const stats = document.getElementById('stats');

    updateProfileImage(); // Always update image

    if (tasks.length === 0) {
        list.innerHTML = '<div class="empty-state">No tasks yet. Add one above!</div>';
        stats.innerHTML = '';
        document.getElementById('resetButton').style.display = 'none';
        return;
    }

    list.innerHTML = tasks.map(t => `
        <li class="task-item ${t.completed ? 'completed' : ''}">
            <input type="checkbox" class="checkbox" ${t.completed ? 'checked' : ''}
                onchange="toggleTask(${t.id})">
            <span class="task-text">${t.text}</span>
            <button class="delete-btn" onclick="deleteTask(${t.id})">Delete</button>
        </li>
    `).join('');

    const done = tasks.filter(t => t.completed).length;
    stats.innerHTML = `${done} of ${tasks.length} tasks completed`;
}

// 🔥 Confetti Animation
function startConfetti() {
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            size: Math.random() * 10 + 5,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: Math.random() * 3 + 2,
            rotation: Math.random() * Math.PI,
            rotationSpeed: (Math.random() - 0.5) * 0.1
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        let allBelow = true;

        particles.forEach(p => {
            p.y += p.speed;
            p.rotation += p.rotationSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size/2, -p.size/2, p.size, p.size);
            ctx.restore();

            if (p.y < canvas.height) allBelow = false;
        });

        if (allBelow) return;
        requestAnimationFrame(animate);
    }

    animate();

    setTimeout(() => {
        canvas.style.display = 'none';
    }, 5000);
}

// Initialize
loadTasks();

window.addEventListener('resize', () => {
    const canvas = document.getElementById('confettiCanvas');
    if (canvas.style.display !== 'none') {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
});