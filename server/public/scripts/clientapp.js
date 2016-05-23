$(document).ready(function () {
  //declare global variables
  var taskName = '';
  var newDueDate = '';

  //Set up DOM with existing database info
  setUpDOM();

  //Create event listeners
  $('#task-input-form').on('submit', addTask);
  $('#task-rows').on('click', '.update', procrastinate);
  $('#task-rows').on('click', '.delete', deleteTask);
  $('#task-rows').on('click', '.complete', completeTask);
  $('#task-rows').on('click', '.overdue', completeOverdueTask);

  //Declare functions
  function procrastinate() {
    //change the due date for a task in the database and on the DOM
    var taskId = getTaskId($(this));
    var taskName = getTaskName($(this));
    console.log(newDueDate, 'taskId:', taskId);
    var sure = confirm('Do you need a little more time to complete the task "' + taskName + '"?');
    if (sure == true) {
      getNewDueDate();
      if (newDueDate != null) {
        $.ajax({
          type: 'PUT',
          url: '/tasks/procrastinate/' + taskId,
          data: newDueDate,
          success: function (data) {
            //reflect the change on the DOM
            setUpDOM();
            alert('You\'ve bought yourself some time. Please use it judiciously!');
          },
        });
      } else {
        alert('Invalid Date');
      }
    } else {
      alert('Good thinking. Git \'er done!');
    }
  }

  function completeTask() {
    //mark a task as complete, along with date completed, in the database and the DOM
    var taskId = getTaskId($(this));
    var taskName = getTaskName($(this));
    var sure = confirm('Did you really complete the task "' + taskName + '"?');
    var reallySure = confirm('You didn\'t half-ass it, did you?');
    if (sure == true && reallySure == true) {
      $.ajax({
          type: 'PUT',
          url: '/tasks/completed/' + taskId,
          data: taskId,
          success: function (data) {
            //reflect the change on the DOM
            setUpDOM();
            alert('Good job!');
          },
        });
    } else {
      alert('Thanks for your honesty. Now give it another go!');
    }
  }

  function completeOverdueTask() {
    //mark a task as complete, along with date completed, in the database and the DOM
    var taskId = getTaskId($(this));
    var taskName = getTaskName($(this));
    var sure = confirm('So you finally completed the task "' + taskName + '"?');
    if (sure == true) {
      $.ajax({
          type: 'PUT',
          url: '/tasks/completed/' + taskId,
          data: taskId,
          success: function (data) {
            //reflect the change on the DOM
            setUpDOM();
            alert('Better late than never!');
          },
        });
    } else {
      alert('Well...keep trying!');
    }
  }

  function deleteTask(event) {
    //delete a task from the database and the DOM
    var taskId = getTaskId($(this));
    var taskName = getTaskName($(this));
    var sure = confirm('Are you sure you want to delete the task "' + taskName + '"?');
    if (sure == true) {
      $.ajax({
        type: 'DELETE',
        url: '/tasks/' + taskId,
        success: function (data) {
          //reflect the changes on the DOM
          setUpDOM();
          deleteTaskResponse(data);
        },
      });
    } else {
      alert('Completing a task is hard...try just getting back to work...');
    }
  }

  function addTask(event) {
    //add a task to the database and the DOM
    event.preventDefault();
    var task = {};
    $.each($('#task-input-form').serializeArray(), function (i, field) {
      task[field.name] = field.value;
    });

    $.ajax({
      type: 'POST',
      url: '/tasks',
      data: task,
      success: function (data) {
        //reflect the change on the DOM
        setUpDOM();
      },
    });
    $('#task-input-form').children().val('');
  }

  function getTasks(tasks) {
    //retrieve the current task information from the database
    var today = new Date();
    $('#task-rows').empty();
    tasks.forEach(function (row) {
      var dateCompleted = '';

      //reword the message from SQL
      if (moment(row.date_completed).format('MMM DD, YYYY') == 'Invalid date') {
        dateCompleted = 'Incomplete';
      } else {
        dateCompleted = moment(row.date_completed).format('MMM DD, YYYY');
      };

      //append the data from database to the DOM
      var $el = $('<tr><td class="larger-field">' + row.task + '</td>' +
         '<td>' + moment(row.date_assigned).format('MMM DD, YYYY') + '</td>' +
         '<td>' + moment(row.date_due).format('MMM DD, YYYY') + '</td>' +
         '<td>' + dateCompleted + '</td></tr>');
      $el.data('taskId', row.id);
      $el.data('taskName', row.task);

      //"if" statements to decide which button to append
      if (row.complete == true) {
        $el.append('<button class="completed">DONE!</button>');
      } else if (moment(row.date_due) < moment(today)) {
        $el.append('<button class="overdue">OVERDUE! Click soon!</button>');
      } else {
        $el.append('<button class="complete">Click when Completed</button>');
      };

      if (row.complete == true) {
        $el.append('<button class="completed">DONE!</button>');
      } else {
        $el.append('<button class="update">Click to Procrastinate</button>');
      };

      $el.append('<button class="delete">Click to Delete</button>');
      $('#task-rows').append($el);

    });
  };

  //UTILITY functions
  function setUpDOM() {
    //put the current database info on the DOM
    $.get('/tasks', getTasks);
  }

  function deleteTaskResponse(res) {
    //alert success or failure of delete
    console.log(res);
    if (res == 'OK') {
      alert('Task "' + taskName + '" deleted!');
    } else {
      alert('Task "' + taskName + '" not deleted!', res);
    }
  }

  function getTaskId(button) {
    //get the task ID
    var taskId = button.parent().data('taskId');
    console.log('getTaskId', taskId);
    return taskId;
  }

  function getTaskName(button) {
    //get the task name
    taskName = button.parent().data('taskName');
    console.log('taskName:', taskName);
    return taskName;
  }

  // function dataPrep(button) {
  //   //get the task data to be changed
  //   var movie = {};
  //   console.log(button.parent().children());
  //   console.log(button.parent().children().serializeArray());
  //   $.each(button.parent().children().serializeArray(), function (i, field) {
  //     movie[field.name] = field.value;
  //   });

  //   return movie;
  // }

  function getNewDueDate() {
    //allow the user to set a new due date
    newDueDate = prompt('Given your current workload, energy level, and ambition, when do you ' +
    'think you can finish this task?', 'MM/DD/YYYY');
    console.log(newDueDate);
  }

  $(function () {
    //jquery UI function to create a calendar for input field
    $('#datepicker').datepicker();
  });

});
