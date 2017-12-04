var request = require('request');
var mockData = require('./postcodeLookupMockData.json');

module.exports = function (req, res) {


    request({
      url: "https://postcodeinfo.service.justice.gov.uk/addresses/?postcode=" + req.query.postcode,
      headers: {
        'Authorization': 'Token 6183e1a4ba446d60237820faf9a52eb56a5c815d'
      }
    }, function(err, resp){
    	if (err) {
		    res.send(mockData);
	    } else {
	      res.send(resp.body);
	  	}
    });



}