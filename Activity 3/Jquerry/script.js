$(document).ready(function() {
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
            var taskItem = $('<li class="task-item"></li>');
            var taskSpan = $('<span class="task-text"></span>').text(taskText);
            var completeBtn = $('<button class="complete-btn">Complete</button>');
            var deleteBtn = $('<button class="delete-btn">Delete</button>');

            taskItem.append(taskSpan, completeBtn, deleteBtn);
            $('#task-list').append(taskItem);

            $('#task-input').val('');

            completeBtn.click(function() {
                taskItem.toggleClass('completed');
            });

            deleteBtn.click(function() {
                taskItem.remove();
            });
        }
    }
});