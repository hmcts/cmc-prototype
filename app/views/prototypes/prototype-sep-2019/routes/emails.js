var strPath = 'prototypes/prototype-sep-2019/';

const express = require('express')
const router = express();



    // The routes file forwards offers requests to this emails router.
    //  MUST BE  /emails
    router.get('/tester', function (req, res)
    {
          res.send('this is the index for emails');
    });



    // DEFENDANT - Respond to default CCJ after one month of it being issued
    router.get('/email-after-one-month-ccj-deadline', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'true';

      res.redirect('/' + strPath +  'defendant/correspondence/email-defaultccj' );
    });


    // DEFENDANT - Respond to default CCJ within one month of it being issued
    router.get('/email-before-one-month-ccj-deadline', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'false';

      res.redirect('/' + strPath +  'defendant/correspondence/email-defaultccj' );
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


    // CLAIMANT - Update about other party requesting a Vary of the CCJ
    router.get('/tell-claimnt-vary-requested', function (req, res)
    {
      req.session.data = {};

      req.session.data['claimantvaryresponse'] = 'true';
      req.session.data['claimantsetsetasideresponse'] = 'false';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/vary/email-notify-claimant-of-vary-request' );
    });


module.exports = router;

