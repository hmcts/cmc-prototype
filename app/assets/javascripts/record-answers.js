'use strict';

moj.Modules.recordAnswers = {
  init: function() {
    var self = this;

    if($('form[data-number]').length) {
      self.checkForSubseqeuentAnswers();
    }

    if($('table.your-answers').length) {
      self.listAnswers();
      self.trimTable();
    }
  },

  recordAnswer: function($form) {
    var storedAnswers = moj.Modules.dataStore.getItem('storedAnswers'),
        answer = {},
        $selectedRadio,
        previouslyAnswered = false;

    if(!storedAnswers) {
      storedAnswers = [];
    }

    answer.question = $('main h1').eq(0).text();

    $selectedRadio = $('main input[type="radio"]:checked').last();

    if($selectedRadio.siblings('strong').length) {
      answer.text = $selectedRadio.siblings('strong').text();
    } else {
      answer.text = $selectedRadio.closest('label').text().trim();
    }

    answer.val = $selectedRadio.val();

    for(var x = 0; x < storedAnswers.length; x++) {
      if(storedAnswers[x].question === answer.question) {
        previouslyAnswered = true;
        storedAnswers[x] = answer;
      }
    }

    if(!previouslyAnswered) {
      storedAnswers[storedAnswers.length] = answer;
    }

    moj.Modules.dataStore.storeItem('storedAnswers', storedAnswers);
  },

  checkForSubseqeuentAnswers: function() {
    var max = $('form').eq(0).data('number'),
        storedAnswers = moj.Modules.dataStore.getItem('storedAnswers'),
        newArray = [];

    if(storedAnswers && storedAnswers.length > max) {
      for(var x = 0; x < max; x++) {
        newArray[newArray.length] = storedAnswers[x];
      }

      moj.Modules.dataStore.storeItem('storedAnswers', newArray);
    }
  },

  listAnswers: function() {
    var storedAnswers = moj.Modules.dataStore.getItem('storedAnswers');

    if(storedAnswers.length) {
      var $table = $('table.your-answers').eq(0),
          html = '',
          other = '';

      $table.find('tbody').empty();

      html += '<tr>';
      html += '<th>Have you challenged HMRC?</th>';
      html += '<td>';
      html += moj.ucFirst(moj.Modules.dataStore.getItem('hmrc_challenge'));
      html += '</td>';
      html += '</tr>';

      for(var x = 0; x < storedAnswers.length; x++) {
        html += '<tr>';
        html += '<th>';
        html += storedAnswers[x].question;
        html += '</th>';
        html += '<td>';

        other = storedAnswers[x].text;

        if(x === storedAnswers.length - 1) {
          if(storedAnswers[x].val === 'other') {
            other = moj.ucFirst(moj.Modules.dataStore.getItem('other_dispute'));
          } else if(storedAnswers[x].val === 'none_of_the_above') {
            other = moj.ucFirst(moj.Modules.dataStore.getItem('other_dispute_type'));
          }
        }

        html += other;
        html += '</td>';
        html += '</tr>';

      }

      if(moj.Modules.dataStore.getItem('penalty_amount')) {
        html += '<tr>';
        html += '<th>What is the penalty or surcharge amount?</th>';
        html += '<td>£';
        html += moj.ucFirst(moj.Modules.dataStore.getItem('penalty_amount'));
        html += '</td>';
        html += '</tr>';
      }

      $table.find('tbody').append(html);
    }
  },

  trimTable: function() {
    var fee = moj.Modules.dataStore.getItem('fee');

    if(fee) {
      $('table.expandable-demo tbody tr').hide();
      $('table.expandable-demo tbody tr.fee-' + fee).show();
    }
  }
};
