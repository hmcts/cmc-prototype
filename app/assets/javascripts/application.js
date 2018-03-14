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
  newDate5.setDate(newDate5.getDate()+ 7);



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

  $('.otherType').on('change',function(){
    if( $(this).val()==="2"){
      $(".evidence-message").text("For example, a signed contract by the claimant");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message").text("For example, a letter from the claimant stating what work they expected you to do.");
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
      $(".evidence-message1").text("For example, a signed contract by the claimant");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message1").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message1").text("For example, a letter from the claimant stating what work they expected you to do.");
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
      $(".evidence-message2").text("For example, a signed contract by the claimant");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message2").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message2").text("For example, a letter from the claimant stating what work they expected you to do.");
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
      $(".evidence-message3").text("For example, a signed contract by the claimant");


    }
    else if ( $(this).val()==="3"){
      $(".evidence-message3").text("For example, a surveyor's report.");
    }
    else if ( $(this).val()==="4"){
      $(".evidence-message3").text("For example, a letter from the claimant stating what work they expected you to do.");
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
	$('.otherType').on('change',function(){
		if( $(this).val()==="4"){
			$(".other").show()
		}
		else if ( $(this).val()==="7"){
			$(".other").show()
		}
		else{
			$(".other").hide()

		}
	});


	$(".summary-link").click(function(){
	    $(".sub").toggle();


	});

 		$(".summary-link2").click(function(){
	    $(".sub2").toggle();


	});



	$('.otherType').on('change',function(){
		if( $(this).val()==="4"){
			$(".evidence-message").text("Please specify");


		}
		else if ( $(this).val()==="7"){
			$(".evidence-message").text("Please specify");
		}
		else{
			$(".evidence-message").text("");
		}
	});

	if ($('form.postcode')) {

	    $('#continue-button').removeClass('button');
	    $('#continue-button').addClass('secondary-button');
	    $('#find-button').click(function(e){
	      e.preventDefault();
	      showSelectAddress();
	    });
	      $('#continue-button').click(function(e){
	        e.preventDefault();
	        $('#select-address').addClass('error');
	        $('#select-address .error-message').show();
	      });
	    $('#postcode-seach-error').hide();
	}



});

function showSelectAddress() {

    $('#address-select-container').removeClass('error');
    $('#address-select-container .error-message').hide();
    $('#enter-manually').show();

  if ( $('#postcode').val().toUpperCase().indexOf('BT') === 0 ) {

    $('#country').val( 'Northern Ireland' );
    $('#postcode-seach-ni-error').show();
    $('#select-address').hide();
    showManaulEntry();

  } else {

      $.ajax({
        url: "/postcode-lookup?postcode=" + encodeURIComponent($('#postcode').val()),
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

            $('#addressList').html(html);

            $('.postcode-as-text p').html($('#postcode').val());
            $('#enter-postcode').hide();
            $('#select-address').show();
            $('#selected-address').hide();
            $('#manual-address').hide();
            $('#postcode-seach-error').hide();
            $('#postcode-seach-ni-error').hide();
            $('#continue-button').unbind('click').click(function(e){
              e.preventDefault();
              $('#address-select-container').addClass('error');
              $('#address-select-container .error-message').show();
            });

          } else {

            $('#postcode-seach-error').show();
            $('#postcode-seach-ni-error').hide();
            showManaulEntry();

          }

        },
        dataType: 'JSON'
      });

      $.ajax({
        url: "/country-lookup?postcode=" + encodeURIComponent($('#postcode').val()),
        method: "GET",
        success: function(data, status, xhr){

            $('#country').val( data.country.name );
      },
        dataType: 'JSON'

      });
    }
  }

 function showSelectedAddress() {
    $('#address-select-container').removeClass('error');
    $('#address-select-container .error-message').hide();
    $('#enter-postcode').hide();
    $('#select-address').show();
    $('#selected-address').hide();
    $('#manual-address').show();
  }

  function updateAddress(address) {
    showSelectedAddress();
    var addresses = $('#addressList').val().split(', ');
    $("#street-1").val(addresses[0]);
    $("#street-2").val(addresses[1]);
    $("#town").val(addresses[2]);
    $("#postcode-full, #postcode-full-auto").val(addresses[3]);
    $('#continue-button').unbind('click');
    $('#find-button').addClass('secondary-button');
    $('#continue-button').removeClass('secondary-button');
    $('#continue-button').addClass('button');
    $('#enter-manually').show();
  }

  function showAbroadAddress() {
    $('#street-label').html('Address');
    $('#postcode-label').html('Postal/ZIP code');
    $('#manual-address').show();
    $('#country').attr('type', 'text');
    $('#manual-address').addClass( 'abroad' );
    $('#enter-manually').hide();
    $('#postcode-finder').hide();
    $('#enter-automatic').show();
    $('#select-address').hide();

    $('#continue-button').unbind('click');
    $('#continue-button').removeClass('secondary-button');
    $('#continue-button').addClass('button');
    return false
  }

 function showPostcodeLookup() {
    $('#manual-address').hide();
    $('#enter-manually').show();
    $('#postcode-finder').show();
    $('#enter-automatic').hide();

    return false
  }


  function showManaulEntry() {
    $('#manual-address').show();

    $("#postcode-full").val( $('#postcode').val() );

    $('#continue-button').unbind('click');
    $('#find-button').addClass('secondary-button');
    $('#continue-button').removeClass('secondary-button');
    $('#continue-button').addClass('button');
    return false;

  }

