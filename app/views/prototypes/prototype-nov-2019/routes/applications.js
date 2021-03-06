var strPath = 'prototypes/prototype-nov-2019/';

const express = require('express')
const router = express();



    // The routes file forwards offers requests to this applications router.
    //  MUST BE  /applications
    router.get('/', function (req, res)
    {
          res.send('this is the index for applications');
    });



    // EXAMPLE  -  /applications/tester
    router.get('/tester', function (req, res)
    {
          req.session.data = {};
          res.send('the new test - session has been CLEARED');
    });



    // DEFENDANT - Respond to default CCJ withig one month of it being issued
    router.get('/respond-to-judgment-within-one-month-of-judgment-being-issued', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'false';
      req.session.data['ccjpaymenttype'] = 'immediately';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/task-list' );
    });



    // DEFENDANT - Respond to default CCJ within one month of it being issued
    router.get('/respond-to-judgment-after-one-month-of-judgment-being-issued', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'true';
      req.session.data['ccjpaymenttype'] = 'immediately';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/task-list' );
    });



    // DEFENDANT - Going from 'Respond to a judgment' task list to will you pay
    router.get('/will-you-pay', function (req, res)
    {
        res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/pay-in-full-now' );

        // If it is before the CCJ 1 month deadline then encourage users to pay immeidatelly, rather than paying whatever the judgment terms are.
        /*
        if(req.session.data['afterccjdeadline'] == 'false')
        {
            res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/pay-in-full-now-regardless-of-judgment' );
        }
        else
        {
            res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/pay-in-full-now' );
        }
        */

    });


    // DEFENDANT - Going from any defendant claim details page to the options of what applications to choose, including general
    router.get('/select-type-of-application', function (req, res)
    {
      var temp = req.session.data['defendant'];

      req.session.data = {};

      req.session.data['defendant'] = temp;

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/general-application/type-of-application' );
    });



    //  CLAIMANT -  Claimant responding to the option of attending a defendants hearing
    router.get('/claimant-respond-to-hearing', function (req, res)
    {
      req.session.data = {};

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/claimant-decide-attend-hearing' );
    });



    // CLAIMANT - Doing a general application from the claim status page
    router.get('/claimant-general-application-only', function (req, res)
    {
      req.session.data = {};

      req.session.data['general-application'] = 'true';
      req.session.data['claimant-application'] = 'true';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/general-application/what' );
    });


    // DEFENDANT - Doing a general application from the claim status page
    router.get('/defendant-general-application-only', function (req, res)
    {
      req.session.data = {};

      req.session.data['general-application'] = 'true';
      req.session.data['defendant-application'] = 'true';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/general-application/what' );
    });


    // HEARING REQUIREMENTS  - SET ASIDE  application
    router.get('/set-aside-application-hearing-requirements', function (req, res)
    {
      req.session.data['scenario'] = 'ccjsetaside';

      res.redirect('/' + strPath +  'defendant/task-list/hearing/support' );
    });



    // HEARING REQUIREMENTS  - GENERAL application
    router.get('/general-application-hearing-requirements', function (req, res)
    {
      res.redirect('/' + strPath +  'defendant/task-list/hearing/support' );
    });


module.exports = router;

