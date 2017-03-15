$(function(){
    $("form.radio-nav").submit(function(e) {
        e.preventDefault();
        window.location = $(this).find('input[type="radio"]:checked').val();
    });
});

$(document).ready(function() {
	// var stickyNavTop = $('.payment-summary-small').offset().top;
	 
	// var stickyNav = function(){
	// var scrollTop = $(window).scrollTop();
	      
	// if (scrollTop > stickyNavTop) { 
	//     $('.payment-summary-small').addClass('sticky');
	// } else {
	//     $('.payment-summary-small').removeClass('sticky'); 
	// }
	// };
	 
	// stickyNav();
	 
	$(window).scroll(function() {
	    stickyNav();
	});

	$('#card-number').keypress(function() {
		if(this.value.length >= 2) {
			$('#visa-image').removeClass("visa-hidden")
		}
	});

	$(".clickable-row").on('click', navigateTo);
});

function navigateTo(evt) {
	window.document.location = $(this).data("href");
}



