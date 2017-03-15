(function () {
  var getSourceField = function () {
    var qStr = window.location.search;

    if (qStr !== '') {
      qStr = qStr.split('=');
      qStr[0] = qStr[0].replace('?', '');
      return qStr;
    }
    return false;
  };

  var uppercase = function (word) {
    return word[0].toUpperCase() + word.substring(1);
  };

  var addH1 = function (field) {
    $('h1').text(uppercase(field[1]));
  };

  var addLabel = function (field) {
    $('label').text(uppercase(field[1]));
  };

  var addFieldDetails = function (field) {
    var $field = $('form input[type=text]');

    $field.attr('name', field[1]);
    if (localStorage[field[1]]) {
      $field.val(localStorage[field[1]]);
    }
  };

  var sourceField = getSourceField();

  if (sourceField) {
    addH1(sourceField);
    addLabel(sourceField);
    addFieldDetails(sourceField);
  }

  $('form').on('submit', function () {
    var $field = $('form input[type=text]');

    if ($field.val() === '') {
      localStorage.removeItem($field.attr('name'));
    } else {
      localStorage[$field.attr('name')] = $field.val();
    }
  });
})();
