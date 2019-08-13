var strPath = 'prototypes/prototype-aug-2019/';

const express = require('express')
const router = express();



    // The routes file forwards sign in requests to this offer router.
    //  MUST BE  strPath  /signin
    router.get('/', function (req, res)
    {

          //res.send('this is the index for signin AND THE session has been destroyed');


          // For the new designs of offers
          if (req.session.data['newoffer'] == 'true')
          {
              // CLAIMANT  arrives here from an email prompt
              if (req.session.data['theclaimant'] == 'true')
              {
                  // Review the response submitted by the defendant -  part admit defence

                  // Review the response submitted by the defendant -  full defence

                  // Offer accepted by defendant.
                  if (req.session.data['offeracceptedbydefendant'] == 'true')
                  {
                      res.redirect('/' + strPath +  'dashboard/defendant?defendant=17.01' );
                  }

                  else if (req.session.data['offerrejectedbydefendant'] == 'true')
                  {
                      // Offer rejected by defendant.  No more offers allowed from the defendant.
                      if (req.session.data['defendantmadeoffer'] == 'true')
                      {
                          res.redirect('/' + strPath +  'dashboard/defendant?defendant=16.133' );
                      }

                      // Offer rejected by defendant.  Review a counter offer put forward by the defendant.
                      else
                      {
                          res.redirect('/' + strPath +  'dashboard/defendant?defendant=16.131' );
                      }
                  }

                  // New offer from defendant.  This offer was created separately from any defence or response
                  else if (req.session.data['firstoffer'] == 'true')
                  {
                      res.redirect('/' + strPath +  'dashboard/defendant?defendant=16.23' );
                  }
              }


              // DEFENDANT  arrives here from an email prompt
              else if (req.session.data['theclaimant'] == 'false')
              {
                  // Respond to the first offer initiated by the claimant
                  if (req.session.data['firstoffer'] == 'true')
                  {
                      res.redirect('/' + strPath +  'dashboard/defendant?defendant=15.13' );
                  }

                  // Offer accepted by claimant
                  else if (req.session.data['claimanthasaccpted'] == 'true')
                  {
                    res.redirect('/' + strPath +  'dashboard/defendant?defendant=15.04' );
                  }

                  // Offer rejected by claimant and defendant isn't allowed any more offers
                  else if (req.session.data['claimanthasaccpted'] == 'false')
                  {
                    res.redirect('/' + strPath +  'dashboard/defendant?defendant=15.18' );
                  }

                  // Offer rejected by claimant but claimant has made a counter offer. No more offers allowed.
                  else if (req.session.data['respondtoclaimantnocounter'] == 'true')
                  {
                    res.redirect('/' + strPath +  'dashboard/defendant?defendant=15.032' );
                  }


                  else if (req.session.data['respondtoclaimantnocounter'] == 'false')
                  {
                      // Offer rejected by claimant but defendant is allowed to make another offer.  Claimant has NOT made a counter offer.
                      if (req.session.data['respondtoclaimantofferonly'] == 'false')
                      {
                        res.redirect('/' + strPath +  'dashboard/defendant?defendant=15.031' );
                      }

                      // Offer rejected by claimant but claimant has made a counter offere. More offers are allowed.
                      else if (req.session.data['respondtoclaimantofferonly'] == 'true')
                      {
                        res.redirect('/' + strPath +  'dashboard/defendant?defendant=15.17' );
                      }
                  }
              }

          }
    });







module.exports = router;

