$(document).ready(function() {
    $.get('https://jsonplaceholder.typicode.com/todos', function(data) {
        data.forEach(function(todo) {
            addTodoItem(todo.title, todo.completed);
        });
    });

    $('#add-task').click(function() {
        addTask();
    });

    $('#task-input').keypress(function(event) {
        if (event.which === 13) {
            addTask();
        }
    });

    function addTask() {
        var taskText = $('#task-input').val().trim();
        if (taskText !== '') {
            addTodoItem(taskText, false);
            $('#task-input').val('');
        }
    }

    function addTodoItem(text, completed) {
        var taskItem = $('<li class="task-item"></li>');
        var taskSpan = $('<span class="task-text"></span>').text(text);
        var completeBtn = $('<button class="complete-btn">Complete</button>');
        var deleteBtn = $('<button class="delete-btn">Delete</button>');

        taskItem.append(taskSpan, completeBtn, deleteBtn);
        $('#task-list').append(taskItem);

        if (completed) {
            taskItem.addClass('completed');
        }

        completeBtn.click(function() {
            taskItem.toggleClass('completed');
        });

        deleteBtn.click(function() {
            taskItem.remove();
        });
    }
});