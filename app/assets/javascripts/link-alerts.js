'use strict';

moj.Modules.linkAlerts = {
  alert_attribute: 'alert',

  init: function() {
    var self = this;

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'a[data-' + self.alert_attribute + ']', function(e) {
      e.preventDefault();
      self.showAlert($(e.target));
    });
  },

  showAlert: function($link) {
    var self = this;

    window.alert($link.data(self.alert_attribute));
  }
};
