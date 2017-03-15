'use strict';

moj.Modules.backLinks = {
  link_class: 'link-back',

  init: function() {
    var self = this;

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('click', 'a.' + self.link_class, function(e) {
      e.preventDefault();
      window.history.back();
    });
  }
};
