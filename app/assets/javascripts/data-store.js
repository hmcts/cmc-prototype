'use strict';

moj.Modules.dataStore = {
  init: function() {
    var self = this,
        storedLength = sessionStorage.length;

    for (var i = storedLength - 1; i >= 0; i--) {
      if($('body').hasClass('clear-session')) {
        self.deleteItem(sessionStorage.key(i));
      }
    }

    self.bindEvents();
  },

  bindEvents: function() {
    var self = this;

    $(document).on('keyup', function(e) {
      if(e.keyCode === 27) {
        self.dumpData();
      }
    });
  },

  dumpData: function() {
    var self = this,
        storedLength = sessionStorage.length;

    moj.log('*** session vars ***');
    for(var i = 0; i < storedLength; i++) {
      moj.log(sessionStorage.key(i) + ' = ' + sessionStorage.getItem(sessionStorage.key(i)));
    }
    moj.log('*** END session vars ***');
  },

  storeItem: function(key, value) {
    sessionStorage.setItem(key, JSON.stringify(value));
  },

  getItem: function(key) {
    return JSON.parse(sessionStorage.getItem(key));
  },

  deleteItem: function(key) {
    sessionStorage.removeItem(key);
  },

  checkForItemsToStore: function($form) {
    var self = this,
        fileEls = $form.find('input[type="file"][data-store]'),
        checkboxEls = $form.find('input[type="checkbox"][data-store]'),
        radioEls = $form.find('input[type="radio"][data-store]:checked'),
        textEls = $form.find('input[type="text"][data-store], input[type="hidden"][data-store], textarea[data-store]');

    if(fileEls.length) {
      fileEls.each(function(n, el) {
        var $el = $(el),
            key = $el.attr('id'),
            value = $el.val(),
            valueArr;

        if(value) {
          valueArr = value.split('\\');
          value = valueArr[valueArr.length - 1];
          self.storeItem(key, value);
        } else {
          self.deleteItem(key);
        }
      });
    }

    if(radioEls.length) {
      radioEls.each(function(n, el) {
        var dataToStore = $(el).data('store'),
            pairs;

        pairs = dataToStore.split(',');

        pairs.forEach(function(pair) {
          var key = pair.split('=')[0],
              value = pair.split('=')[1];

          self.storeItem(key, value);
        });
      });
    }

    if(textEls.length) {
      textEls.each(function(n, el) {
        var $el = $(el),
            key = $el.attr('id'),
            value = $el.val();

        if(value && $el.is(':visible')) {
          self.storeItem(key, value);
        } else {
          self.deleteItem(key);
        }
      });
    }

    if(checkboxEls.length) {
      checkboxEls.each(function(n, el) {
        var $el = $(el),
            key = $el.attr('id'),
            checked = $el.is(':checked'),
            value = $el.val();

        if(checked) {
          self.storeItem(key, value);
        } else {
          self.deleteItem(key);
        }
      });
    }
  }
};
