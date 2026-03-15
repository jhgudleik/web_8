// Основной массив задач
let tasks = [];
let currentFilter = 'all';

// Инициализация
$(document).ready(function() {
    // Обработчики событий
    $('#addButton').on('click', addTask);
    $('#taskInput').on('keypress', function(e) {
        if (e.which === 13) { // Enter key
            addTask();
        }
    });

    $('.filter-btn').on('click', function() {
        currentFilter = $(this).data('filter');
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        renderTasks();
    });

    // Делегирование событий для динамических элементов
    $(document).on('click', '.delete-btn', function() {
        const taskId = parseInt($(this).data('id'));
        deleteTask(taskId);
    });

    $(document).on('click', '.toggle-btn', function() {
        const taskId = parseInt($(this).data('id'));
        toggleTaskStatus(taskId);
    });
});

// Добавление задачи
function addTask() {
    const taskText = $('#taskInput').val().trim();
    if (!taskText) return;

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);
    $('#taskInput').val('');
    renderTasks();
    renderStats();
}

// Удаление задачи
function deleteTask(taskId) {
    tasks = tasks.filter(task => task.id !== taskId);
    renderTasks();
    renderStats();
}

// Изменение статуса задачи
function toggleTaskStatus(taskId) {
    const task = tasks.find(task => task.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
        renderStats();
    }
}

// Получение отфильтрованных задач
function getFilteredTasks() {
    switch (currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'active':
            return tasks.filter(task => !task.completed);
        default:
            return tasks;
    }
}

// Рендеринг списка задач
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    const $taskList = $('#taskList');

    if (filteredTasks.length === 0) {
        $taskList.html('<div class="empty-message">Задач пока нет</div>');
        return;
    }

    let html = '';
    filteredTasks.forEach(task => {
        html += `
            <div class="task ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                <input type="checkbox" class="toggle-btn" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" data-id="${task.id}">Удалить</button>
            </div>
        `;
    });

    $taskList.html(html);
}

// Рендеринг статистики
function renderStats() {
    const total = tasks.length;
    const completed = tasks.filter(task => task.completed).length;
    const active = total - completed;

    $('#totalCount').text(total);
    $('#completedCount').text(completed);
    $('#activeCount').text(active);
}
