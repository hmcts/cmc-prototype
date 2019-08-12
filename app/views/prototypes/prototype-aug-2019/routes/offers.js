var strPath = 'prototypes/prototype-aug-2019/';

const express = require('express')
const router = express();



    // The routes file forwards offers requests to this offer router.
    //  MUST BE  /offers
    router.get('/', function (req, res)
    {
          res.send('this is the index for offers');
    });



    // EXAMPLE  -  /offers/tester
    router.get('/tester', function (req, res)
    {
          res.send('the new test');
    });



    // DEFENDANT - Offer rejected - Respond to counteroffer only
    router.get('/defendant-offer-rejected-respond-to-counteroffer-only', function (req, res)
    {
        req.session.data['theclaimant'] = 'false';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'false';
        req.session.data['claimanthasaccpted'] = 'null';
        req.session.data['respondtoclaimantnocounter'] = 'false';
        req.session.data['respondtoclaimantofferonly'] = 'true';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );

    });





module.exports = router;

