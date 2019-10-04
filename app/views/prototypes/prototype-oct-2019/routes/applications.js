var strPath = 'prototypes/prototype-oct-2019/';

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
    router.get('/respond-to-judgement-within-one-month-of-judgement-being-issued', function (req, res)
    {
      req.session.data = {};

      req.session.data['defaultccj'] = 'true';
      req.session.data['afterccjdeadline'] = 'false';
      req.session.data['ccjpaymenttype'] = 'immediately';

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/set-aside-default-ccj/task-list' );
    });



    // DEFENDANT - Respond to default CCJ withig one month of it being issued
    router.get('/respond-to-judgement-after-one-month-of-judgement-being-issued', function (req, res)
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

        // If it is before the CCJ 1 month deadline then encourage users to pay immeidatelly, rather than paying whatever the judgement terms are.
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
      req.session.data = {};

      res.redirect('/' + strPath +  'dashboard/applications-and-judgments/general-application/type-of-application' );
    });





module.exports = router;

