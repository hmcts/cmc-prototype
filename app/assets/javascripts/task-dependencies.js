'use strict';

moj.Modules.taskDependencies = {
  tasks: [],
  $button: null,

  init: function() {
    var self = this,
        $button = $('.js-start-task');

    if($button.length) {
      self.$button = $button.eq(0);
      self.getTasks();
    }
  },

  getTasks: function() {
    var self = this,
        dependencies = self.$button.data('dependent-tasks');

    if(dependencies.length) {
      moj.Modules.taskList.getTasksRemotely(function(tasks) {
        self.checkMetDependencies(tasks, dependencies);
      });
    };
  },

  checkMetDependencies: function(tasks, dependencies) {
    var self = this,
        unmetDependencies = [];

    for(var x = 0; x < dependencies.length; x++) {
      if(moj.Modules.dataStore.getItem('task_'+tasks[x]) !== 'complete') {
        unmetDependencies.push(dependencies[x]);
      }
    }

    if(unmetDependencies.length) {
      self.disableButton(unmetDependencies);
    }
  },

  disableButton: function(unmetDependencies) {
    var self = this,
        message = self.createMessage(unmetDependencies);

    self.$button.addClass('disabled').on('click', function(e) {
      e.preventDefault();
    }).before('<p class="disable-message">' + message + '</p><p><a class="link-back js-link-back" href="">Back</a></p>');
  },

  createMessage: function(unmetDependencies) {
    var message = 'Please complete step';

    switch(unmetDependencies.length) {
      case 1:
        message += ' ' + unmetDependencies[0];
        break;
      case 2:
        message += 's ' + unmetDependencies[0] + ' and ' + unmetDependencies[1];
        break;
      default:
        message += 's ';
        for(var x = 0; x < unmetDependencies.length - 1; x++) {
          message += unmetDependencies[x] + ', ';
        }
        message += ' and ' + unmetDependencies[unmetDependencies.length - 1];
    }
    message += ' first';

    return message;
  }
};
