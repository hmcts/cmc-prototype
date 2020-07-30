var strPath = 'prototypes/prototype-may-2020/';

const express = require('express')
const router = express();



    // The routes file forwards offers requests to this emails router.
    //  MUST BE  /emails
    router.get('/tester', function (req, res)
    {
          res.send('this is the index for emails');
    });



    // SET ASIDE JUDGMENT


    // DEFENDANT - Respond to default CCJ after one month of it being issued
    router.get('/email-after-one-month-ccj-deadline', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'true';

      res.redirect('/' + strPath +  'defendant/correspondence/email-defaultccj-initial-after' );
    });


    // DEFENDANT - Respond to default CCJ within one month of it being issued
    router.get('/email-before-one-month-ccj-deadline', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'false';

      res.redirect('/' + strPath +  'defendant/correspondence/email-defaultccj-initial' );
    });


    // CLAIMANT - Update about other party requesting a set aside of the CCJ
    router.get('/tell-claimnt-set-aside-requested', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'false';
      req.session.data['claimantvaryresponse'] = 'false';
      req.session.data['claimantsetsetasideresponse'] = 'true';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/email-ccj-set-aside-hearing' );
    });





    // VARY A JUDGMENT


    // CLAIMANT - Update about other party requesting a Vary of the CCJ
    router.get('/tell-claimant-vary-requested', function (req, res)
    {
      req.session.data = {};

      req.session.data['claimantvaryresponse'] = 'true';
      req.session.data['claimantsetsetasideresponse'] = 'false';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/vary/email-notify-claimant-of-vary-request' );
    });



    // DEFENDANT - Vary plan accepted by the Claimant
    router.get('/tell-defendant-claimant-has-responded-to-vary-request-accept-plan', function (req, res)
    {
        req.session.data = {};

        req.session.data['defendantgetsvaryresponse'] = 'true';
        req.session.data['planaccepted'] = 'true';

        res.redirect('/' + strPath +  'defendant/correspondence/email-vary-result' );
    });


    // DEFENDANT - Vary plan proposed by claimant
    router.get('/tell-defendant-claimant-has-responded-to-vary-request-claimant-plan', function (req, res)
    {
      req.session.data = {};

      req.session.data['defendantgetsvaryresponse'] = 'true';
      req.session.data['claimantplan'] = 'true';

      res.redirect('/' + strPath +  'defendant/correspondence/email-vary-result' );
    });


    // DEFENDANT - Vary plan proposed by court/determination
    router.get('/tell-defendant-claimant-has-responded-to-vary-request-court-plan', function (req, res)
    {
      req.session.data = {};

      req.session.data['defendantgetsvaryresponse'] = 'true';
      req.session.data['courtplan'] = 'true';

      res.redirect('/' + strPath +  'defendant/correspondence/email-vary-result' );
    });


    // DEFENDANT - Claimant has asked for redetermination
    router.get('/tell-defendant-claimant-has-responded-to-vary-request-redetermination', function (req, res)
    {
      req.session.data = {};

      req.session.data['defendantgetsvaryresponse'] = 'true';
      req.session.data['redetermination'] = 'true';

      res.redirect('/' + strPath +  'defendant/correspondence/email-vary-result' );
    });


    // DEFENDANT - Update about other party requesting a Vary of the CCJ
    router.get('/tell-defendant-claimant-did-not-respond', function (req, res)
    {
        req.session.data = {};

        req.session.data['defendantgetsvaryresponse'] = 'true';
        req.session.data['noresponsefromclaimant'] = 'true';

        res.redirect('/' + strPath +  'defendant/correspondence/email-vary-result-no-response' );
    });





module.exports = router;
