var request = require('request');

module.exports = function (req, res) {


    request({
      url: "https://postcodeinfo.service.justice.gov.uk/postcodes/" + req.query.postcode,
      headers: {
        'Authorization': 'Token 6183e1a4ba446d60237820faf9a52eb56a5c815d'
      }
    }, function(err, resp){
    	if (err) {
	    	res.send( dumbCountryLookup( req.query.postcode ) );
	    } else {
      		res.send( resp.body );
      	}
    });


}

// offline dummy lookup
function dumbCountryLookup( strPostcode ) {

	firstDigit = strPostcode.match(/\d/) 
	indexed = strPostcode.indexOf(firstDigit)


	strPostArea = strPostcode.substr( 0, indexed ).toUpperCase();

	if (strPostArea.indexOf('BT') === 0 ) {
		strCountry = "Northern Ireland";
	} else if ( [ 'CF', 'LD', 'LL', 'NP', 'SA' ].indexOf(strPostArea) > -1 ) {
		strCountry = "Wales";
	} else if ( [ 'AB', 'DD', 'DG', 'EH', 'FK', 'G', 'HS', 'IV', 'KA', 'KW', 'KY', 'ML', 'PA', 'PH', 'TD', 'ZE' ].indexOf(strPostArea) > -1 ) {
		strCountry = "Scotland";
	} else {
		strCountry = "England";
	}
	
	return '{"country":{"name":"' + strCountry + '"}}';
}