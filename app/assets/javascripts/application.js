/* global $ */
/* global GOVUK */

// Warn about using the kit in production
if (
  window.sessionStorage && window.sessionStorage.getItem('prototypeWarning') !== 'false' &&
  window.console && window.console.info
  ) {
  window.console.info('GOV.UK Prototype Kit - do not use for production')
window.sessionStorage.setItem('prototypeWarning', true)
}

$(document).ready(function () {
  // Use GOV.UK shim-links-with-button-role.js to trigger a link styled to look like a button,
  // with role="button" when the space key is pressed.
  GOVUK.shimLinksWithButtonRole.init()

  // Show and hide toggled content
  // Where .multiple-choice uses the data-target attribute
  // to toggle hidden content
  var showHideContent = new GOVUK.ShowHideContent()
  showHideContent.init()
})

// task list
function ShowHideContent() {
  var self = this;

  self.escapeElementName = function(str) {
    result = str.replace('[', '\\[').replace(']', '\\]')
    return(result);
  };

  self.showHideRadioToggledContent = function () {
    $(".block-label input[type='radio']").each(function () {

      var $radio = $(this);
      var $radioGroupName = $radio.attr('name');
      var $radioLabel = $radio.parent('label');

      var dataTarget = $radioLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (dataTarget) {

        // Set aria-controls
        $radio.attr('aria-controls', dataTarget);

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $radio.closest('form').find(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {
            var $this = $(this);

            var groupDataTarget = $this.parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.addClass('js-hidden');
            // Set aria-expanded and aria-hidden for hidden content
            $this.attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

          var $dataTarget = $('#' + dataTarget);
          $dataTarget.removeClass('js-hidden');
          // Set aria-expanded and aria-hidden for clicked radio
          $radio.attr('aria-expanded', 'true');
          $dataTarget.attr('aria-hidden', 'false');

        });

      } else {
        // If the data-target attribute is undefined for a radio button,
        // hide visible data-target content for radio buttons in the same group

        $radio.on('click', function () {

          // Select radio buttons in the same group
          $(".block-label input[name=" + self.escapeElementName($radioGroupName) + "]").each(function () {

            var groupDataTarget = $(this).parent('label').attr('data-target');
            var $groupDataTarget = $('#' + groupDataTarget);

            // Hide toggled content
            $groupDataTarget.addClass('js-hidden');
            // Set aria-expanded and aria-hidden for hidden content
            $(this).attr('aria-expanded', 'false');
            $groupDataTarget.attr('aria-hidden', 'true');
          });

        });
      }

    });
  }
  self.showHideCheckboxToggledContent = function () {

    $(".block-label input[type='checkbox']").each(function() {

      var $checkbox = $(this);
      var $checkboxLabel = $(this).parent();

      var $dataTarget = $checkboxLabel.attr('data-target');

      // Add ARIA attributes

      // If the data-target attribute is defined
      if (typeof $dataTarget !== 'undefined' && $dataTarget !== false) {

        // Set aria-controls
        $checkbox.attr('aria-controls', $dataTarget);

        // Set aria-expanded and aria-hidden
        $checkbox.attr('aria-expanded', 'false');
        $('#'+$dataTarget).attr('aria-hidden', 'true');

        // For checkboxes revealing hidden content
        $checkbox.on('click', function() {

          var state = $(this).attr('aria-expanded') === 'false' ? true : false;

          // Toggle hidden content
          $('#'+$dataTarget).toggleClass('js-hidden');

          // Update aria-expanded and aria-hidden attributes
          $(this).attr('aria-expanded', state);
          $('#'+$dataTarget).attr('aria-hidden', !state);

        });
      }

    });
  }
}

$(document).ready(function() {

  // Use GOV.UK selection-buttons.js to set selected
  // and focused states for block labels
  var $blockLabels = $(".block-label input[type='radio'], .block-label input[type='checkbox']");
  new GOVUK.SelectionButtons($blockLabels);

  // Show and hide toggled content
  // Where .block-label uses the data-target attribute
  var toggleContent = new ShowHideContent();
  toggleContent.showHideRadioToggledContent();
  toggleContent.showHideCheckboxToggledContent();


  //orders task list numbers
  var $groupNumbers = $( ".group-number" );

  $groupNumbers.each(function(index) {

    $( this ).append(index+1+".");

  });

  //orders task list numbers
  var $stepNumbers = $( ".step-number" );

  $stepNumbers.each(function(index) {

    $( this ).append(index+1+".");

  });

  $('#total-steps').text($stepNumbers.length);
  $('#total-steps').text($stepNumbers.length);


  var $completedTasks = $( ".task-status-banner" );

  $('#completed-steps').text($completedTasks.length);

});

// Add another item in /transport_goods/task_list/describe_vehicles/reg_number_weight

$(document).on('click', '.button-add-another', function (e) {
  var beforeThis = $(this).closest('.grid-row');
  e.preventDefault();
  insertFields(beforeThis);
  sortFields();
});

$(document).on('click', '.remove-list-item', function (e) {
  e.preventDefault();
  $(this).parents('.list-item-wrapper').remove();
  sortFields();
});

function insertFields(element) {
  element.before(
    '<div class="grid-row">' +
    '<div class="form-group-compound list-item-wrapper">' +
    '<h2 class="heading-medium">Vehicle 1</h2>' +
    '<fieldset>' +
    '<div class="column-one-third no-padding">' +
    '<div class="form-group list-item">' +
    '<label class="form-label" for="field-x">' +
    'Registration number' +
    '</label>' +
    '<input type="text" class="form-control" id="field-x" name="field-x">' +
    '</div>' +
    '</div>' +
    '<div class="column-one-third no-padding">' +
    '<div class="form-group list-item">' +
    '<label class="form-label" for="field-x">' +
    'Weight when loaded' +
    '</label>' +
    '<input type="text" class="form-control" id="field-x" name="field-x">' +
    '</div>' +
    '</div>' +
    '<div class="column-one-third no-padding">' +
    '<div class="list-item">' +
    '</div>' +
    '</div>' +
    '</fieldset>' +
    '</div>' +
    '</div>'
    );
}

function sortFields() {
  var listCounter = 1;
  var inputCounter = 1;

  $(document).find('.list-item-wrapper').each(function () {
    $(this).find('h2').text('Vehicle ' + listCounter);

    if ($(this).find('.remove-list-item').length === 0) {
      $(this).find('.list-item:last').append('<a id="remove-item-' + listCounter + '" class="remove-list-item" href="#">Remove this</a>');
    } else {
      $(this).find('.remove-list-item').attr('id', 'remove-item-' + listCounter);
    }

    $(this).find('.list-item').children('label').each(function () {
      $(this).attr('for', 'field-' + inputCounter);
      inputCounter++;
    });

    $(this).find('.list-item').children('input').each(function () {
      var labelNo = $(this).parent().find('label').attr('for').split('-').pop();
      $(this).attr('id', 'field-' + labelNo);
      $(this).attr('name', 'field-' + labelNo);
    });

    listCounter++;
  });

  if ($(document).find('.list-item-wrapper').length === 1) {
    $('.remove-list-item').remove();
  }
}

$(document).ready(function() {

  var monthNames = [ "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December" ];

  var newDate = new Date();
  newDate.setDate(newDate.getDate()+ 14) ;

  var newDate2 = new Date();
  newDate2.setDate(newDate2.getDate()) ;

  var newDate3 = new Date();
  newDate3.setDate(newDate3.getDate()+ 28) ;

/*$('#Date').html(" " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
*/$('#Date').html(" " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
$('#Date2').html(" " + newDate2.getDate() + ' ' + monthNames[newDate2.getMonth()] + ' ' + newDate2.getFullYear());
$('#Date3').html(" " + newDate3.getDate() + ' ' + monthNames[newDate3.getMonth()] + ' ' + newDate3.getFullYear());

});




$( document ).ready(function() {
  $( ".toggle" ).click(function(e) {
         e.preventDefault();

    $( ".show-more" ).toggle();
    $( ".toggle" ).toggle();
  });
});



            $(document).ready(function () {
              $('#add-another-event-button').click(function (event) {
                event.preventDefault();
                $('#timeline').append(
                  '<div class="timeline-row" style="margin-top: 15px;">' +
                  ' <select class="form-control-select" name="legal-status" id="legal-status"> <option>-- Please make a selection --</option> <option value="1">Contracts and agreements</option> <option value="2">Letters, emails and other correspondence</option> <option value="2">Photo evidence</option> <option value="3">Receipts</option><option value="4">Statements of account</option> <option value="5">Other</option> </select>' +
                  '</div>'
                  );
              });

              if ($('#legal-status1').val() > 1 || $('#legal-status1').val() == 'other') {
                $(".other").show()
              }

              $('.otherType').on('change',function(){
                if( $(this).val()==="1"){
                  $(".other").hide()
                }
                else{
                  $(".other").show()
                }
              });  


              $('.otherType1').on('change',function(){
          if( $(this).val()==="1"){
                  $(".other1").hide()
                }
                else{
                  $(".other1").show()
                }
              }); 

              $('.otherType2').on('change',function(){
            if( $(this).val()==="1"){
                  $(".other2").hide()
                }
                else{
                  $(".other2").show()
                }
              }); 
              $('.otherType3').on('change',function(){
          if( $(this).val()==="1"){
                  $(".other3").hide()
                }
                else{
                  $(".other3").show()
                }
              }); 



            });
     

