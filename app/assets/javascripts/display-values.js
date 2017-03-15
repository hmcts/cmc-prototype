'use strict';

moj.Modules.displayValues = {
  data_attribute: 'key',

  init: function() {
    var self = this,
        elements = $('[data-' + self.data_attribute + ']');

    if(elements.length) {
      self.writeValues(elements);
    }
  },

  writeValues: function(elements) {
    var self = this;

    elements.each(function(n, element) {
      var $el = $(element),
          dataKey = $el.data(self.data_attribute),
          dataValue = moj.Modules.dataStore.getItem(dataKey),
          writeVal;

      if(dataValue) {
        writeVal = dataValue;
        if($el.hasClass('js_breaklines')) {
          writeVal = writeVal.replace(/(?:\r\n|\r|\n)/g, '<br>');
        }
        if($el.hasClass('js_uc_first')) {
          writeVal = moj.ucFirst(writeVal);
        }
        $el.html(writeVal);
      }
    });
  }
};
