'use strict';

moj.Modules.dependentFields = {
  init: function() {
    var self = this,
        fields = $('[data-dependent]');

    if(fields.length) {
      self.checkDependentFields(fields);
    }
  },

  checkDependentFields: function(fields) {
    fields.each(function(n, field) {
      var $field = $(field),
          storedPair = $field.data('dependent'),
          key = storedPair.split('=')[0],
          value = storedPair.split('=')[1];

      if(moj.Modules.dataStore.getItem(key) === value) {
        $field.removeClass('js-hidden');
      }
    });
  }
};
