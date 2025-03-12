// Initialize tasks from localStorage or set to an empty array
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Elements for DOM manipulation
const taskInput = document.getElementById('task-input');
const tasksContainer = document.querySelector('.tasks');
const itemsLeftSpan = document.getElementById('items-left');
const allTasksButton = document.getElementById('all-tasks');
const activeTasksButton = document.getElementById('active-tasks');
const completedTasksButton = document.getElementById('completed-tasks');
const clearAllButton = document.getElementById('clearAll');

taskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && taskInput.value.trim()) {
        addTask(taskInput.value.trim());
        taskInput.value = '';
    }
});

function addTask(title) {
    const newTask = {
        id: Date.now(), 
        title: title,
        status: 'active' 
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks(); 
}

function removeTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks(); 
}

function toggleComplete(id) {
    const task = tasks.find(task => task.id === id);
    if (task) {
        task.status = task.status === 'completed' ? 'active' : 'completed';
        saveTasks();
        renderTasks(); 
    }
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    updateItemsLeft();
}

function renderTasks() {
    tasksContainer.innerHTML = ''; 
    tasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" class="task-checkbox-input" ${task.status === 'completed' ? 'checked' : ''} data-id="${task.id}">
            </div>
            <span class="task-title ${task.status}">${task.title}</span>
            <button class="delete-task-btn" data-id="${task.id}">X</button>
        `;
        tasksContainer.appendChild(taskElement);
    });
    updateItemsLeft();
}

function filterTasks(status) {
    let filteredTasks = tasks;
    if (status === 'active') {
        filteredTasks = tasks.filter(task => task.status === 'active');
    } else if (status === 'completed') {
        filteredTasks = tasks.filter(task => task.status === 'completed');
    }
    return filteredTasks;
}

function updateItemsLeft() {
    const activeTasksCount = tasks.filter(task => task.status === 'active').length;
    itemsLeftSpan.textContent = activeTasksCount;
}

allTasksButton.addEventListener('click', () => {
    renderTasks();
    setActiveFilter('all');
});
activeTasksButton.addEventListener('click', () => {
    const activeTasks = filterTasks('active');
    renderFilteredTasks(activeTasks);
    setActiveFilter('active');
});
completedTasksButton.addEventListener('click', () => {
    const completedTasks = filterTasks('completed');
    renderFilteredTasks(completedTasks);
    setActiveFilter('completed');
});

clearAllButton.addEventListener('click', () => {
    tasks = tasks.filter(task => task.status !== 'completed');
    saveTasks();
    renderTasks();
});

function renderFilteredTasks(filteredTasks) {
    tasksContainer.innerHTML = ''; 
    filteredTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" class="task-checkbox-input" ${task.status === 'completed' ? 'checked' : ''} data-id="${task.id}">
            </div>
            <span class="task-title ${task.status}">${task.title}</span>
            <button class="delete-task-btn" data-id="${task.id}">X</button>
        `;
        tasksContainer.appendChild(taskElement);
    });
    updateItemsLeft();
}

tasksContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-task-btn')) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        removeTask(taskId);
    }

    if (e.target.classList.contains('task-checkbox-input')) {
        const taskId = parseInt(e.target.getAttribute('data-id'));
        toggleComplete(taskId);
    }
});

function setActiveFilter(status) {
    document.querySelectorAll('.controller ul li').forEach(button => {
        button.classList.remove('active');
    });
    const activeButton = document.getElementById(`${status}-tasks`);
    activeButton.classList.add('active');
}

renderTasks();
