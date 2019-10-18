$(document).ready(function() {
  const selects = document.querySelectorAll('.auto-comp-field select');
  $.each(selects, function(index, select) {
    accessibleAutocomplete.enhanceSelectElement({
      selectElement: select,
      minLength: 2,
      source: function(query, populateResults) {
        var options = Array.from(select.options).map(function(opt){
          return opt.value;
        });
        var startingWithLetter = _.remove(options, function(opt) {
          return opt.match(new RegExp('^' + query + '.+', 'i'));
        });
        var containingLetter = _. remove(options, function(opt) {
          return opt.match(new RegExp('^.+' + query + '+', 'i'));
        });
        return populateResults([...startingWithLetter, ...containingLetter]);
      }
    });
  });
});