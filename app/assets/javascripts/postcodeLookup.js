var request = require('request');
var mockData = require('./postcodeLookupMockData.json');

module.exports = function (req, res) {

    request({
      url: "https://api.ordnancesurvey.co.uk/places/v1/addresses/postcode?offset=0&key=NhjoVbGqxiHGK5f9SWc7xhaTHQsa6MHG&postcode=" + req.query.postcode
    }, function(err, resp){
    	if (err) {
		    res.send(mockData);
	    } else {
	      res.send(resp.body);
	  	}
    });

}
