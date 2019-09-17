var strPath = 'prototypes/prototype-sep-2019/';

const express = require('express')
const router = express();



    // The routes file forwards offers requests to this offer router.
    //  MUST BE  /applications
    router.get('/', function (req, res)
    {
          res.send('this is the index for offers');
    });



    // EXAMPLE  -  /applications/tester
    router.get('/tester', function (req, res)
    {
          req.session.destroy();
          res.send('the new test - session has been CLEARED');
    });







module.exports = router;

