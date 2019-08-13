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
          req.session.destroy();
          res.send('the new test - session hass been CLEARED');
    });


    // CLAIMANT  -  Review the response submitted by the defendant -  part admit defence

    // CLAIMANT  -  Review the response submitted by the defendant -  full defence

    // CLAIMANT  -  Offer accepted by defendant.
    router.get('/claimant-offer-accepted', function (req, res)
    {
      req.session.data = {};
      req.session.data['theclaimant'] = 'true';
      req.session.data['newoffer'] = 'true';
      req.session.data['firstoffer'] = 'false';
      req.session.data['partadmitstart'] = 'false';
      req.session.data['offerwasrejected'] = 'false';
      req.session.data['defendantmadeoffer'] = 'false';
      req.session.data['offeracceptedbydefendant'] = 'true';
      req.session.data['offerrejectedbydefendant'] = 'false';

      res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-claimant' );
    });


    // CLAIMANT  -  Offer rejected by defendant.  No more offers allowed from the defendant.
    router.get('/claimant-offer-rejected-only', function (req, res)
    {
      req.session.data = {};
      req.session.data['theclaimant'] = 'true';
      req.session.data['newoffer'] = 'true';
      req.session.data['firstoffer'] = 'false';
      req.session.data['partadmitstart'] = 'false';
      req.session.data['offerwasrejected'] = 'false';
      req.session.data['defendantmadeoffer'] = 'false';
      req.session.data['offeracceptedbydefendant'] = 'false';
      req.session.data['offerrejectedbydefendant'] = 'true';

      res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-claimant' );
    });


    // CLAIMANT  -  Offer rejected by defendant.  Review a counter offer put forward by the defendant.
    router.get('/claimant-offer-rejected-review-counter-offer', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'true';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'false';
        req.session.data['partadmitstart'] = 'false';
        req.session.data['offerwasrejected'] = 'true';
        req.session.data['defendantmadeoffer'] = 'true';
        req.session.data['offeracceptedbydefendant'] = 'false';
        req.session.data['offerrejectedbydefendant'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-claimant' );
    });


    // CLAIMANT  -  New offer from defendant.  This offer was created separately from any defence or response
    router.get('/claimant-offer-made-by-defendant', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'true';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'true';
        req.session.data['partadmitstart'] = 'false';
        req.session.data['offerwasrejected'] = 'false';
        req.session.data['defendantmadeoffer'] = 'false';
        req.session.data['offeracceptedbydefendant'] = 'false';
        req.session.data['offerrejectedbydefendant'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-claimant' );
    });







    // DEFENDANT  -  Respond to the first offer initiated by the claimant
    router.get('/defendant-offer-offer-made-by-claimant', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'false';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'true';
        req.session.data['claimanthasaccpted'] = 'false';
        req.session.data['respondtoclaimantnocounter'] = 'false';
        req.session.data['respondtoclaimantofferonly'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );
    });


    // DEFENDANT  -  Offer accepted by claimant
    router.get('/defendant-offer-accepted', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'false';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'false';
        req.session.data['claimanthasaccpted'] = 'true';
        req.session.data['respondtoclaimantnocounter'] = 'false';
        req.session.data['respondtoclaimantofferonly'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );
    });


    // DEFENDANT  -  Offer rejected by claimant and defendant isn't allowed any more offers
    router.get('/defendant-offer-rejected-no-more-actions', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'false';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'false';
        req.session.data['claimanthasaccpted'] = 'false';
        req.session.data['respondtoclaimantnocounter'] = 'false';
        req.session.data['respondtoclaimantofferonly'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );
    });


    // DEFENDANT  -  Offer rejected by claimant but claimant has made a counter offer.  No more offers allowed.
    router.get('/defendant-offer-rejected-respond-to-counteroffer-no-more-offers', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'false';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'false';
        req.session.data['claimanthasaccpted'] = 'null';
        req.session.data['respondtoclaimantnocounter'] = 'true';
        req.session.data['respondtoclaimantofferonly'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );
    });


    // DEFENDANT  -  Offer rejected by claimant but defendant is allowed to make another offer.  Claimant has NOT made a counter offer.
    router.get('/defendant-offer-rejected-respond-make-another-offer-only', function (req, res)
    {
        req.session.data = {};
        req.session.data['theclaimant'] = 'false';
        req.session.data['newoffer'] = 'true';
        req.session.data['firstoffer'] = 'false';
        req.session.data['claimanthasaccpted'] = 'null';
        req.session.data['respondtoclaimantnocounter'] = 'false';
        req.session.data['respondtoclaimantofferonly'] = 'false';

        res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );
    });


    // DEFENDANT  -  Offer rejected by claimant but claimant has made a counter offere.  More offers are allowed.
    router.get('/defendant-offer-rejected-respond-to-counteroffer-and-more-offers', function (req, res)
    {
      req.session.data = {};
      req.session.data['theclaimant'] = 'false';
      req.session.data['newoffer'] = 'true';
      req.session.data['firstoffer'] = 'false';
      req.session.data['claimanthasaccpted'] = 'null';
      req.session.data['respondtoclaimantnocounter'] = 'false';
      req.session.data['respondtoclaimantofferonly'] = 'true';

      res.redirect('/' + strPath +  'dashboard/offer-agreement/new-offers/email-offer-update-defendant' );
    });







module.exports = router;

