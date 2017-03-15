(function () {
  var getLinkField = function ($link) {
      var qStr = $link.attr('href').split('?')[1];

      return qStr.split('=');
  };

  var getSourceField = function () {
    var qStr = window.location.search;

    if (qStr !== '') {
      qStr = qStr.split('=');
      qStr[0] = qStr[0].replace('?', '');
      return qStr;
    }
    return false;
  };

  var addTicks = function () {
    var tick = '<span class="tick">' +
                 '<img src="/app/assets/images/tick.svg" alt="done" width="15" height="14">' +
               '</span>';

    $('a.field').each(function () {
      var field = getLinkField($(this));
      var $ticks = $(this).siblings().filter('.tick');
      
      if (localStorage[field[1]]) {
        if ($ticks.length === 0) {
          $(tick).insertBefore(this);
        }
      }
      else {
        $ticks.remove();  
      }
    });
  };

  var sourceField = getSourceField();
  var $fieldLink;

  if (sourceField) {
    localStorage[sourceField[0]] = sourceField[1];
  }
  addTicks();
})();
