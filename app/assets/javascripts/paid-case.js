'use strict';

moj.Modules.paidCase = {
  form_id: 'case_requests',
  paid_keyword: 'paid',

  init: function() {
    var self = this;

    if($('form#' + self.form_id).length) {
      self.bindEvents();
    }
  },

  bindEvents: function() {
    var self = this,
        $form = $('form#' + self.form_id);

    $form.on('submit', function(e) {
      e.preventDefault();
      self.checkPaid($form);
    });
  },

  checkPaid: function($form) {
    var self = this,
        paid = false;

    $form.find('input').each(function(n, input) {
      if($(input).val() === self.paid_keyword) {
        paid = true;
      }
    });

    document.location = (paid ? $form.data('alt-url') : $form.attr('action'));
  }
};
