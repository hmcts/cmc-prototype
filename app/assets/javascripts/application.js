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


  var monthNamesCal = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec" ];



  var newDate = new Date();
  newDate.setDate(newDate.getDate()+ 19) ;

  var newDate2 = new Date();
  newDate2.setDate(newDate2.getDate()) ;

  var newDate3 = new Date();
  newDate3.setDate(newDate3.getDate()+ 33);

  var newDate4 = new Date();
  newDate4.setDate(newDate4.getDate()+ 7);

  var newDate5 = new Date();
  newDate5.setDate(newDate5.getDate()+ 5);



/*$('#Date').html(" " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
*/$('#Date, .dates').html(" " + newDate.getDate() + ' ' + monthNames[newDate.getMonth()] + ' ' + newDate.getFullYear());
$('#Date2, .dates2').html(" " + newDate2.getDate() + ' ' + monthNames[newDate2.getMonth()] + ' ' + newDate2.getFullYear());
$('#Date3, .dates3').html(" " + newDate3.getDate() + ' ' + monthNames[newDate3.getMonth()] + ' ' + newDate3.getFullYear());
$('#Date4, .dates4').html(" " + newDate4.getDate() + ' ' + monthNamesCal[newDate4.getMonth()] + ' ' + newDate4.getFullYear());
$('#Date5, .dates5').html(" " + newDate5.getDate() + ' ' + monthNamesCal[newDate5.getMonth()] + ' ' + newDate5.getFullYear());

});




$( document ).ready(function() {
  $( ".toggle" ).click(function(e) {
   e.preventDefault();

   $( ".show-more" ).toggle();
   $( ".toggle" ).toggle();
 });
});



$(document).ready(function () {
  $('#add-another-event-button2').click(function (event) {
    event.preventDefault();
    $('#timeline').append(
      '<div class="timeline-row" style="margin-top: 15px;">' +
      ' <select class="form-control-select" name="legal-status" id="legal-status"> <option>-- Please make a selection --</option> <option value="1">Contracts and agreements</option> <option value="2">Letters, emails and other correspondence</option> <option value="2">Photo evidence</option> <option value="3">Receipts</option><option value="4">Statements of account</option> <option value="5">Other</option> </select>' +
      '</div>'
      );
  });

  if ($('#legal-status1').val() > 1 || $('#legal-status1').val() == 'other') {
console.log( 'here3' );

    $(".other").show()
  }

  $('.otherType').on('change',function(){
console.log( 'here' );
    if( $(this).val()==="1"){
      $(".other").hide()
    }
    else{
      $(".other").show()
    }
  });

  $('.otherType').on('change',function(){
console.log( 'here2', $(this).val() );

    if( $(this).val()==="2"){
      $(".evidence-message").text("For example, a signed contract.");
    }
    else if ( $(this).val()==="3"){
console.log( 'here4' );
console.log( $(".evidence-message") );
$(".evidence-message").show();
      $(".evidence-message").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message").text("For example, a letter from the other party describing the work they expected you to do.");
    }
    else if ( $(this).val()==="5"){
      $(".evidence-message").text("For example, a photo of the work you carried out.");
    }
    else if ( $(this).val()==="6"){
      $(".evidence-message").text("For example, a receipt showing you've paid the claimant.");
    }
    else if ( $(this).val()==="7"){
      $(".evidence-message").text("For example, a bank statement showing you've paid the claimant.");
    }
    else if ( $(this).val()==="other"){
      $(".evidence-message").text("");
    }
  });

  $('.otherType1').on('change',function(){
    if( $(this).val()==="2"){
      $(".evidence-message1").text("For example, a signed contract.");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message1").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message1").text("For example, a letter from the other party describing the work they expected you to do.");
    }
    else if ( $(this).val()==="5"){
      $(".evidence-message1").text("For example, a photo of the work you carried out.");
    }
    else if ( $(this).val()==="6"){
      $(".evidence-message1").text("For example, a receipt showing you've paid the claimant.");
    }
    else if ( $(this).val()==="7"){
      $(".evidence-message1").text("For example, a bank statement showing you've paid the claimant.");
    }
    else if ( $(this).val()==="other"){
      $(".evidence-message1").text("");
    }
  });

  $('.otherType2').on('change',function(){
    if( $(this).val()==="2"){
      $(".evidence-message2").text("For example, a signed contract.");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message2").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message2").text("For example, a letter from the other party describing the work they expected you to do.");
    }
    else if ( $(this).val()==="5"){
      $(".evidence-message2").text("For example, a photo of the work you carried out.");
    }
    else if ( $(this).val()==="6"){
      $(".evidence-message2").text("For example, a receipt showing you've paid the claimant.");
    }
    else if ( $(this).val()==="7"){
      $(".evidence-message2").text("For example, a bank statement showing you've paid the claimant.");
    }
    else if ( $(this).val()==="other"){
      $(".evidence-message2").text("");
    }
  });

  $('.otherType3').on('change',function(){
    if( $(this).val()==="2"){
      $(".evidence-message3").text("For example, a signed contract.");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message3").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message3").text("For example, a letter from the other party.");
    }
    else if ( $(this).val()==="5"){
      $(".evidence-message3").text("For example, a photo of the work you carried out.");
    }
    else if ( $(this).val()==="6"){
      $(".evidence-message3").text("For example, a receipt showing you've paid the claimant.");
    }
    else if ( $(this).val()==="7"){
      $(".evidence-message3").text("For example, a bank statement showing you've paid the claimant.");
    }
    else if ( $(this).val()==="other"){
      $(".evidence-message3").text("");
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
function goBack() {
  event.preventDefault();
  window.history.back();
}




$( document ).ready(function() {



	$(".summary-link").click(function(){
	    $(".sub").toggle();


	});

 		$(".summary-link2").click(function(){
	    $(".sub2").toggle();


	});




	if ($('form.postcode')) {

	    $('#continue-button').removeClass('button');
	    $('#continue-button').addClass('secondary-button');
	    $('.find-button').click(function(e){
	      e.preventDefault();
	      showSelectAddress();
	    });
	      $('#continue-button').click(function(e){
	        e.preventDefault();
	        $('.select-address').addClass('error');
	        $('.select-address .error-message').show();
	      });
	    $('#postcode-seach-error').hide();
	}



});

function showSelectAddress( strPrefix ) {

    $('#' + strPrefix + '_address-select-container').removeClass('error');
    $('#' + strPrefix + '_address-select-container .error-message').hide();
    $('#' + strPrefix + '_enter-manually').show();

  if ( $('#' + strPrefix + '_postcode').val().toUpperCase().indexOf('BT') === 0 ) {

    $('#' + strPrefix + '_country').val( 'Northern Ireland' );
    $('#' + strPrefix + '_postcode-seach-ni-error').show();
    $('#' + strPrefix + '_select-address').hide();
    showManaulEntry( strPrefix );

  } else {

      $.ajax({
        url: "/postcode-lookup?postcode=" + encodeURIComponent($('#' + strPrefix + '_postcode').val()),
        method: "GET",
        success: function(data, status, xhr){
          if(status === "success" && data.length){

            var html = '<option>' + data.length + ' addresses found </option>';

            jQuery.each( data, function(key, value){
              var formatted_address = [
                ( value.organisation_name || value.sub_building_name ) + ' ' + ( value.building_number || value.building_name || null),
                value.thoroughfare_name || value.dependent_locality,
                value.post_town,
                value.postcode
              ];
              html += '<option value="' + formatted_address.join(', ').trim() + '">' + formatted_address.join(', ').trim() + '</option>';
            });

            $('#' + strPrefix + '_addressList').html(html);

            $('.postcode-as-text p').html($('#' + strPrefix + '_postcode').val());
            $('#' + strPrefix + '_enter-postcode').hide();
            $('#' + strPrefix + '_select-address').show();
            $('#' + strPrefix + '_selected-address').hide();
            $('#' + strPrefix + '_manual-address').hide();
            $('#' + strPrefix + '_postcode-seach-error').hide();
            $('#' + strPrefix + '_postcode-seach-ni-error').hide();
            $('#' + strPrefix + '_continue-button').unbind('click').click(function(e){
              e.preventDefault();
              $('#' + strPrefix + '_address-select-container').addClass('error');
              $('#' + strPrefix + '_address-select-container .error-message').show();
            });

          } else {

            $('#' + strPrefix + '_postcode-seach-error').show();
            $('#' + strPrefix + '_postcode-seach-ni-error').hide();
            showManaulEntry( strPrefix );

          }

        },
        dataType: 'JSON'
      });

      $.ajax({
        url: "/country-lookup?postcode=" + encodeURIComponent($('#' + strPrefix + '_postcode').val()),
        method: "GET",
        success: function(data, status, xhr){

            $('#' + strPrefix + '_country').val( data.country.name );
      },
        dataType: 'JSON'

      });
    }
  }

 function showSelectedAddress( strPrefix ) {
    $('#' + strPrefix + '_address-select-container').removeClass('error');
    $('#' + strPrefix + '_address-select-container .error-message').hide();
    $('#' + strPrefix + '_enter-postcode').hide();
    $('#' + strPrefix + '_select-address').show();
    $('#' + strPrefix + '_selected-address').hide();
    $('#' + strPrefix + '_manual-address').show();
  }

  function updateAddress( address, strPrefix ) {
    showSelectedAddress( strPrefix );
    var addresses = $('#' + strPrefix + '_addressList').val().split(', ');
    $('#' + strPrefix  + "_street-1").val(addresses[0]);
    $('#' + strPrefix  + "_street-2").val(addresses[1]);
    $('#' + strPrefix  + "_town").val(addresses[2]);
    $('#' + strPrefix  + "_postcode-full, #" + strPrefix  + "_postcode-full-auto").val(addresses[3]);
    $('#' + strPrefix + '_continue-button').unbind('click');
    $('#' + strPrefix + '_find-button').addClass('secondary-button');
    $('#' + strPrefix + '_continue-button').removeClass('secondary-button');
    $('#' + strPrefix + '_continue-button').addClass('button');
    $('#' + strPrefix + '_enter-manually').hide();
  }

  function showAbroadAddress( strPrefix ) {
    $('#' + strPrefix + '_street-label').html('Address');
    $('#' + strPrefix + '_postcode-label').html('Postal/ZIP code');
    $('#' + strPrefix + '_manual-address').show();
    $('#' + strPrefix + '_country').attr('type', 'text');
    $('#' + strPrefix + '_manual-address').addClass( 'abroad' );
    $('#' + strPrefix + '_enter-manually').hide();
    $('#' + strPrefix + '_postcode-finder').hide();
    $('#' + strPrefix + '_enter-automatic').show();
    $('#' + strPrefix + '_select-address').hide();

    $('#' + strPrefix + '_continue-button').unbind('click');
    $('#' + strPrefix + '_continue-button').removeClass('secondary-button');
    $('#' + strPrefix + '_continue-button').addClass('button');
    return false
  }

 function showPostcodeLookup( strPrefix ) {
    $('#' + strPrefix + '_manual-address').hide();
    $('#' + strPrefix + '_enter-manually').show();
    $('#' + strPrefix + '_postcode-finder').show();
    $('#' + strPrefix + '_enter-automatic').hide();

    return false
  }


  function showManaulEntry( strPrefix ) {
    console.log(strPrefix);
    $('#' + strPrefix + '_manual-address').show();
    $('#' + strPrefix  + "_postcode-full").val( $('#' + strPrefix + '_postcode').val() );
    $('#' + strPrefix + '_continue-button').unbind('click');
    $('#' + strPrefix + '_find-button').addClass('secondary-button');
    $('#' + strPrefix + '_continue-button').removeClass('secondary-button');
    $('#' + strPrefix + '_continue-button').addClass('button');
    return false;

  }

/* TABS PATTERN */
function tabGroup (tableObj, which) {
  tabA = 'TAB-ONE'
  tabB = 'TAB-TWO'
  tabC = 'TAB-THREE'
  tabD = 'TAB-FOUR'

  if (which == tabA) {
    document.getElementById('tabA').className = 'tab-on'
    document.getElementById('tabB').className = 'tab'
    document.getElementById('tabC').className = 'tab'
    document.getElementById('tabD').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'block'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'none'
  } else if (which == tabB) {
    document.getElementById('tabA').className = 'tab'
    document.getElementById('tabB').className = 'tab-on'
    document.getElementById('tabC').className = 'tab'
    document.getElementById('tabD').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'block'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'none'
  } else if (which == tabC) {
    document.getElementById('tabA').className = 'tab'
    document.getElementById('tabB').className = 'tab'
    document.getElementById('tabC').className = 'tab-on'
    document.getElementById('tabD').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'block'
    document.getElementById('tabFourContent').style.display = 'none'
  } else if (which == tabD) {
    document.getElementById('tabA').className = 'tab'
    document.getElementById('tabB').className = 'tab'
    document.getElementById('tabC').className = 'tab'
    document.getElementById('tabD').className = 'tab-on'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'block'
  }
}

/* TABS PATTERN */
function tabGroup2 (tableObj, which) {
  tabE = 'TAB-ONE'
  tabF = 'TAB-TWO'
  tabG = 'TAB-THREE'

  if (which == tabE) {
    document.getElementById('tabE').className = 'tab-on'
    document.getElementById('tabF').className = 'tab'
    document.getElementById('tabG').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'block'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'none'
  } else if (which == tabF) {
    document.getElementById('tabE').className = 'tab'
    document.getElementById('tabF').className = 'tab-on'
    document.getElementById('tabG').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'block'
    document.getElementById('tabThreeContent').style.display = 'none'
  } else if (which == tabG) {
    document.getElementById('tabE').className = 'tab'
    document.getElementById('tabF').className = 'tab'
    document.getElementById('tabG').className = 'tab-on'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'block'
  }
}

/* TABS PATTERN */
function tabGroup3 (tableObj, which) {
  tabH = 'TAB-ONE'
  tabI = 'TAB-TWO'

  if (which == tabH) {
    document.getElementById('tabH').className = 'tab-on'
    document.getElementById('tabI').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'block'
    document.getElementById('tabTwoContent').style.display = 'none'
  } else if (which == tabI) {
    document.getElementById('tabH').className = 'tab'
    document.getElementById('tabI').className = 'tab-on'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'block'
  }
}

/* TABS PATTERN */
function tabGroup4 (tableObj, which) {
  tabJ = 'TAB-ONE'
  tabK = 'TAB-TWO'
  tabL = 'TAB-THREE'
  tabM = 'TAB-FOUR'
  tabN = 'TAB-FIVE'

  if (which == tabJ) {
    document.getElementById('tabJ').className = 'tab-on'
    document.getElementById('tabK').className = 'tab'
    document.getElementById('tabL').className = 'tab'
    document.getElementById('tabM').className = 'tab'
    document.getElementById('tabN').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'block'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'none'
    document.getElementById('tabFiveContent').style.display = 'none'
  } else if (which == tabK) {
    document.getElementById('tabJ').className = 'tab'
    document.getElementById('tabK').className = 'tab-on'
    document.getElementById('tabL').className = 'tab'
    document.getElementById('tabM').className = 'tab'
    document.getElementById('tabN').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'block'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'none'
    document.getElementById('tabFiveContent').style.display = 'none'
  } else if (which == tabL) {
    document.getElementById('tabJ').className = 'tab'
    document.getElementById('tabK').className = 'tab'
    document.getElementById('tabL').className = 'tab-on'
    document.getElementById('tabM').className = 'tab'
    document.getElementById('tabN').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'block'
    document.getElementById('tabFourContent').style.display = 'none'
    document.getElementById('tabFiveContent').style.display = 'none'
  } else if (which == tabM) {
    document.getElementById('tabJ').className = 'tab'
    document.getElementById('tabK').className = 'tab'
    document.getElementById('tabL').className = 'tab'
    document.getElementById('tabM').className = 'tab-on'
    document.getElementById('tabN').className = 'tab'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'block'
    document.getElementById('tabFiveContent').style.display = 'none'
  } else if (which == tabN) {
    document.getElementById('tabJ').className = 'tab'
    document.getElementById('tabK').className = 'tab'
    document.getElementById('tabL').className = 'tab'
    document.getElementById('tabM').className = 'tab'
    document.getElementById('tabN').className = 'tab-on'
    document.getElementById('tabOneContent').style.display = 'none'
    document.getElementById('tabTwoContent').style.display = 'none'
    document.getElementById('tabThreeContent').style.display = 'none'
    document.getElementById('tabFourContent').style.display = 'none'
    document.getElementById('tabFiveContent').style.display = 'block'
  }
}

/* LISTS - EXPANDABLE ROW PATTERN */
row1status = true
row2status = true
row3status = true
row4status = true
row5status = true
function tableRow (n) {
  /* Row 1 */
  if ((n == 1) || (n == 2)) {
    if (row1status) {
      // alert(rowOpenCloseStatus);
      document.getElementById('row1closed').style = 'display: none'
      document.getElementById('row1opened').style = 'display: inline-row'
    } else {
      // alert(rowOpenCloseStatus);
      document.getElementById('row1closed').style = 'display: inline-row'
      document.getElementById('row1opened').style = 'display: none'
    }
    row1status = !row1status
  }
  /* Row 2 */
  if ((n == 3) || (n == 4)) {
    if (row2status) {
      // alert(rowOpenCloseStatus);
      document.getElementById('row2closed').style = 'display: none'
      document.getElementById('row2opened').style = 'display: inline-row'
    } else {
      // alert(rowOpenCloseStatus);
      document.getElementById('row2closed').style = 'display: inline-row'
      document.getElementById('row2opened').style = 'display: none'
    }
    row2status = !row2status
  }
  /* Row 3 */
  if ((n == 5) || (n == 6)) {
    if (row3status) {
      // alert(rowOpenCloseStatus);
      document.getElementById('row3closed').style = 'display: none'
      document.getElementById('row3opened').style = 'display: inline-row'
    } else {
      // alert(rowOpenCloseStatus);
      document.getElementById('row3closed').style = 'display: inline-row'
      document.getElementById('row3opened').style = 'display: none'
    }
    row3status = !row3status
  }
  /* Row 4 */
  if ((n == 7) || (n == 8)) {
    if (row4status) {
      // alert(rowOpenCloseStatus);
      document.getElementById('row4closed').style = 'display: none'
      document.getElementById('row4opened').style = 'display: inline-row'
    } else {
      // alert(rowOpenCloseStatus);
      document.getElementById('row4closed').style = 'display: inline-row'
      document.getElementById('row4opened').style = 'display: none'
    }
    row4status = !row4status
  }
  /* Row 5 */
  if ((n == 9) || (n == 10)) {
    if (row5status) {
      // alert(rowOpenCloseStatus);
      document.getElementById('row5closed').style = 'display: none'
      document.getElementById('row5opened').style = 'display: inline-row'
    } else {
      // alert(rowOpenCloseStatus);
      document.getElementById('row5closed').style = 'display: inline-row'
      document.getElementById('row5opened').style = 'display: none'
    }
    row5status = !row5status
  }
}

/* CASE FILE */
var Casefile = function (container) {
  this.container = container
  this.items = container.find('.jui-cf__files')
  this.comments = container.find('.jui-cf__document-comments')
  this.itemsButton = container.find('.jui-cf__toolbar-button--items')
  this.commentsButton = container.find('.jui-cf__toolbar-button--comments')
  this.itemsButton.on('click', $.proxy(this, 'onButtonItemsClick'))
  this.commentsButton.on('click', $.proxy(this, 'onButtonCommentsClick'))
  this.showItems()
  this.hideComments()
}

Casefile.prototype.hideComments = function () {
  this.container.removeClass('jui-cf--show-comments')
  this.comments.hide()
  this.commentsButton.attr('aria-pressed', 'false')
}

Casefile.prototype.hideItems = function () {
  this.items.hide()
  this.itemsButton.attr('aria-pressed', 'false')
}

Casefile.prototype.showComments = function () {
  this.container.addClass('jui-cf--show-comments')
  this.comments.show()
  this.commentsButton.attr('aria-pressed', 'true')
}

Casefile.prototype.showItems = function () {
  this.items.show()
  this.itemsButton.attr('aria-pressed', 'true')
}

Casefile.prototype.onButtonItemsClick = function (e) {
  this.showItems()
  this.hideComments()
}

Casefile.prototype.onButtonCommentsClick = function (e) {
  this.showComments()
  this.hideItems()
}


// //Select entire table row
// $(".table-clickable tbody tr").click(function (e) {
//   if (e.target.type == "checkbox") {
//     // stop the bubbling to prevent firing the rows click event
//     e.stopPropagation()
//   } else {
//     // Click the
//     if ($(this).hasClass("checked")) {
//       $(this).find("input").click()
//       $(this).removeClass("checked")
//     } else {
//       $(this).find("input").click()
//       $(this).addClass("checked")
//     }
//   }
// })

// // table row click-able
// $(document).ready(function() {
//
//   $('#clickable-link tr').click(function() {
//     var href = $(this).find("a").attr("href");
//     if(href) {
//       window.location = href;
//     }
//   });
//
// });

// table row click-able
// $(".table-clickable-row tbody tr").click(function(){
//   window.location = $(that).parent().data('href');
// });

$("#claim-details-single").click(function(){
  window.location = "claim-details-timeline";
});

$("#claim-details-multi").click(function(){
  window.location = "claim-details-multi-parties";
});


/* tab navigation and content show/hide */
//Check the href of each link in the sidebar
$('.navbar__list-items a').click(function (e) {
  e.preventDefault();
  var target = $(this);
  target.parents('.navbar').find('.active').removeClass('active');
  target.parents('li').addClass('active');
  target.parents().find('h1:first').text($(this).text());
});

/* updates toggle */
function ShowHideUpdates () {
  var self = this;

  self.toggleUpdates = function() {
    var $updatesContainer = $('.updates-container');
    var $i = $('.updates-toggle i');
    $i.on('click', function() {
      var $this = $(this);
      if ($this.hasClass('fa-caret-right')) {
        $this.removeClass('fa-caret-right');
        $this.addClass('fa-caret-down');
        $this.find('span').text('Hide previous updates');
        $updatesContainer.css('display', 'block');
      } else {
        $this.removeClass('fa-caret-down');
        $this.addClass('fa-caret-right');
        $this.find('span').text('View previous updates');
        $updatesContainer.css('display', 'none');
      }
    })
  }
}

$(document).ready(function () {
  var showHideUpdates =  new ShowHideUpdates();
  showHideUpdates.toggleUpdates();
  tabs();
});

function daysPass (page, waitTime, days) {
  var theWaitTime = waitTime || 3000
  setTimeout(function () {
    $('#triggerDaysPassing').addClass('active')
  }, theWaitTime)
  $('#triggerDaysPassing').on('click', function () {
    $('#daysPassing').addClass('active')
    $('#triggerDaysPassing').removeClass('active')
    for (var i = 0; i <= days; ++i) {
      setTimeout((function (x) {
        return function () {
          $('#days').html(x)
        }
      })(i), i * 1000)
    }
    setTimeout(function () { document.location.href = page }, (days * 1000))
  })
}

if ($('#daysPassing').length === 1) {
  var url = ($('#daysPassing').attr('data-dayspassurl'))
  var timeToPrompt = ($('#daysPassing').attr('data-dayspasstimetoprompt')) || 5000
  var days = ($('#daysPassing').attr('data-dayspassdays')) || 5
  daysPass(url, timeToPrompt, days)
}

if ($('#phoneBackground #phone-mockup').length === 1) {
  $('#phone-mockup').on('click', function () {
    $('#phoneBackground').toggleClass('active')
    $(this).toggleClass('active')
  })
}

if ($('#phoneAccessCode #phone-mockup').length === 1) {
  setTimeout(function () {
    $('#phone-mockup').toggleClass('active')
  }, (3000))
}

$(document).ready(function () {
  window.GOVUKFrontend.initAll()
})

