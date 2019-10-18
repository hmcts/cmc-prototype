var strPath = 'prototypes/prototype-oct-2019/';


// Find the offers js file
const offersRouter = require('./offers');
// Find the sign in js file
const signinRouter = require('./signin');
// Find the applications js file
const applicationsRouter = require('./applications');
// Find the emails js file
const emailsRouter = require('./emails');


module.exports = function(app)
{

  // Forwards any requests of the each sections router URL to the offers Router js file
  app.use( '/' + strPath + 'offers', offersRouter);
  app.use( '/' + strPath + 'signin', signinRouter);
  app.use( '/' + strPath + 'applications', applicationsRouter);
  app.use( '/' + strPath + 'emails', emailsRouter);



  // Route index page
  app.get('/', function (req, res) {
    res.render('index')
  })
  app.post('/', function (req, res) {
    res.clearCookie(stateCookieName)
    res.render('index')
  })



  // add your routes here
  app.get('/postcode', function (req, res, next) {
    res.render('partials/addresses', {
      addresses: mockAddressesFor(req.query.postcode)
    })
  })


  const defaultState = () => {
    return {
      claim: {
        css_class: "not-started",
        status: "Not Reviewed"
      },
      agreement: {
        css_class: "not-started",
        status: "Not Reviewed"
      },
      about_agreement: {
        css_class: "not-started",
        status: "Not Reviewed"
      },
      broken_agreement: {
        css_class: "not-started",
        status: "Not Reviewed"
      },
    }
  }

  const stateCookieName = 'AGREEMENT_STATE'

  const getAgreementStateCookie = (req) => {
    return req.cookies[stateCookieName] ? JSON.parse(req.cookies[stateCookieName]) : defaultState()
  }

  const setAgreementStateCookie = (res, cookie) => {
    res.cookie(stateCookieName, JSON.stringify(cookie))
  }

  const agreementPage = '/prototype-13/review-agreement';
  app.get(agreementPage, (req, res) => {
    const cookie = getAgreementStateCookie(req)
    if (isEqual(cookie, defaultState())) {
      setAgreementStateCookie(res, defaultState())
    }

    cookie.allAccepted = cookie.agreement.status === 'Reviewed'
      && cookie.about_agreement.status === 'Reviewed' && cookie.broken_agreement.status === 'Reviewed'

    res.render('prototype-13/review-agreement', cookie)
  })




  app.post( '/' + strPath + 'defendant/task-list/do-you-owe-money/are-you-owed', (req, res) => {

    if ( req.session.data['response-owed'] && req.session.data['amount-owed'] >= 1500 ) {
      req.session.data['radio_select_group'] = 'all';
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['response'] = 'FULL-ADMIT';

    } else if ( req.session.data['response-owed'] && req.session.data['amount-owed'] > 0) {
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['amount_pa'] = 'complete';
      req.session.data['radio_select_group'] = 'Some';
      req.session.data['show_mediation'] = 'true';

      req.session.data['response'] = 'PART-ADMIT';


    } else if ( req.session.data['response-owed'] && req.session.data['amount-owed'] == 0) {
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['show_mediation'] = 'true';

    }


    if ( req.session.data['response-owed'] && req.session.data['response-owed'] == 'yes' ) {
      res.redirect('/' + strPath + 'defendant/task-list/do-you-owe-money/amount-owed');

    }
    else if ( req.session.data['response-owed'] )
    {
      if( req.session.data['cancelccj'] == 'true')
      {
        res.redirect('/' + strPath + 'dashboard/applications-and-judgments/set-aside-default-ccj/task-list?whydontowe=complete&radio_select_group=notpaid&response=DEFENCE&');
      }
      else {
        res.redirect('/' + strPath + 'defendant/task-list');
      }

    } else {
      res.render( strPath + 'defendant/task-list/do-you-owe-money/are-you-owed' );
    }

  })


  app.post( '/' + strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/are-you-owed', (req, res) => {

    if ( req.session.data['response-owed'] && req.session.data['amount-owed'] >= 370 ) {
      req.session.data['radio_select_group'] = 'all';
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['response'] = 'FULL-ADMIT';

    } else if ( req.session.data['response-owed'] && req.session.data['amount-owed'] > 0) {
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['amount_pa'] = 'complete';
      req.session.data['radio_select_group'] = 'Some';
      req.session.data['show_mediation'] = 'true';

      req.session.data['response'] = 'PART-ADMIT';


    } else if ( req.session.data['response-owed'] && req.session.data['amount-owed'] == 0) {
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['show_mediation'] = 'true';

    }


    if ( req.session.data['response-owed'] && req.session.data['response-owed'] == 'yes' ) {
      res.redirect('/' + strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/amount-owed');

    } else if ( req.session.data['response-owed'] ) {
      res.redirect('/' + strPath + 'defendant/mediation-pilot/task-list');

    } else {
      res.render( strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/are-you-owed' );
    }

  })





  app.post( '/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer', (req, res) => {


    if ( req.session.data['claimant-payment-request'] ) {

      if ( req.session.data['defendant'] == 'org' && req.session.data['claimant-payment-request'] == 'Immediately' ) {

          res.redirect( '../task-list' );

      } else if ( req.session.data['claimant-payment-request'] == 'Immediately' )  {
            if (req.session.data['vary'] == 'true')
            {
                res.redirect( 'counter-offer/court-date?proposedplan=immediately&' );
            }
            else
            {
                res.redirect( 'counter-offer/court-date' );
            }


      } else if ( req.session.data['claimant-payment-request'] == 'Set-date' )  {
            if (req.session.data['vary'] == 'true')
            {
                res.redirect( 'counter-offer/pay-by-set-date?proposedplan=setdate&' );
            }
            else
            {
                res.redirect( 'counter-offer/pay-by-set-date' );
            }


      } else if ( req.session.data['claimant-payment-request'] == 'Instalments' )  {
            if (req.session.data['vary'] == 'true')
            {
                res.redirect( 'counter-offer/repayment-plan?proposedplan=instalments&' );
            }
            else
            {
                res.redirect( 'counter-offer/repayment-plan' );
            }
      }


    } else {
      res.render( strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/index' );

    }

  })




  app.post( '/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer', (req, res) => {


    if ( req.session.data['radio-pay-group'] ) {

      if ( req.session.data['defendant'] == 'org' && req.session.data['radio-pay-group'] == 'Immediately' ) {

        if (req.session.data['return'] == 'less-than' ) {
          res.redirect( '../../paid-what-owe-less-claim-amount/task-list' );
        } else {
          res.redirect( '../task-list' );
        }

      } else if ( req.session.data['radio-pay-group'] == 'Immediately' )  {
        res.redirect( 'counter-offer/court-date' );

      } else if ( req.session.data['radio-pay-group'] == 'Set-date' )  {
        res.redirect( 'counter-offer/pay-by-set-date' );

      } else if ( req.session.data['radio-pay-group'] == 'Instalments' )  {
        res.redirect( 'counter-offer/repayment-plan' );
      }


    } else {
      res.render( strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/index' );

    }

  })



  app.post( '/' + strPath + 'defendant/task-list/do-you-owe-money/defence-options', (req, res) => {

    if ( req.session.data['radio_select_group2'] && req.session.data['radio_select_group2'] == 'paid' ) {
      req.session.data['radio_select_group'] = 'paid';
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['show_mediation'] = 'true';
      req.session.data['response'] = 'STATES-PAID';

      if( req.session.data['cancelccj']=='true'  &&  req.session.data['fulldefence']=='true' )
      {
          res.redirect('/' + strPath + 'dashboard/applications-and-judgments/set-aside-default-ccj/task-list?whydontowe=complete&');
      }
      else
      {
          res.redirect('/' + strPath + 'defendant/task-list?');
      }


    } else if ( req.session.data['radio_select_group2'] && req.session.data['radio_select_group2'] == 'defend_now' ) {
      req.session.data['response'] = 'DEFENCE';

      res.redirect('/' + strPath + 'defendant/task-list/do-you-owe-money/are-you-owed');

    } else if ( req.session.data['radio_select_group2'] && req.session.data['radio_select_group2'] == 'counter' ) {

      res.redirect('/' + strPath + 'defendant/task-list/do-you-owe-money/amount-owed');
      req.session.data['response'] = 'COUNTER';


    } else {
      res.render( strPath + 'defendant/task-list/do-you-owe-money/defence-options' );

    }

  })


  app.post( '/' + strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/defence-options', (req, res) => {

    if ( req.session.data['radio_select_group2'] && req.session.data['radio_select_group2'] == 'paid' ) {
      req.session.data['radio_select_group'] = 'paid';
      req.session.data['do_you_owe_money'] = 'complete';
      req.session.data['show_mediation'] = 'true';
      req.session.data['response'] = 'STATES-PAID';

      res.redirect('/' + strPath + 'defendant/mediation-pilot/task-list');

    } else if ( req.session.data['radio_select_group2'] && req.session.data['radio_select_group2'] == 'defend_now' ) {
      req.session.data['response'] = 'DEFENCE';

      res.redirect('/' + strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/are-you-owed');

    } else if ( req.session.data['radio_select_group2'] && req.session.data['radio_select_group2'] == 'counter' ) {

      res.redirect('/' + strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/amount-owed');
      req.session.data['response'] = 'COUNTER';


    } else {
      res.render( strPath + 'defendant/mediation-pilot/task-list/do-you-owe-money/defence-options' );

    }

  })




  app.get( '/' + strPath + 'defendant/task-list/counter-claim/counter-type', (req, res) => {

      if ( req.session.data['response-owe'] != 'owe-none' && (req.session.data['counter-amount']*1 >= req.session.data['amount-owed']*1 ) ) {
          req.session.data['counter'] = 'SET-OFF-COUNTER';
          // set off and counter

          // this includes full and partial admission - may need seperate routes for both

      } else if ( (req.session.data['counter-amount'] > 0) && ( req.session.data['amount-owed']*1 == 0 ) ) {
          req.session.data['counter'] = 'FULL-COUNTER';
        // full counterclaim


      } else {
        // set off
        req.session.data['counter'] = 'SET-OFF';

      }

    req.session.data['do_you_owe_money'] = 'complete';

    res.redirect( '../../../claimant/task-list/claim-amount-alt/total' );
  })



  app.get( '/' + strPath + 'defendant/task-list/counter-claim/counter-proceed', (req, res) => {

    if ( req.session.data['counterclaim-proceed'] == 'no' ) {
          req.session.data['counter'] = 'NOT-PROCEED';
    }

/*
    if (req.session.data['counter-amount'] > ( (req.session.data['amount-owed']*1) + 10000 ) && req.session.data['counterclaim-proceed'] == 'yes'  ) {
      res.redirect('/' + strPath + 'defendant/task-list/do-you-owe-money/counter-amount-handoff');

    } else */if ( req.session.data['counterclaim-proceed'] == 'yes' ) {
      res.redirect('/' + strPath + 'defendant/task-list/do-you-owe-money/counter-hwf' );

    } else {
      res.redirect('/' + strPath + 'defendant/task-list' );
    }

  })


  // FULL ADMIT - CLAIMANT RESPONDS TO PAYMENT PLAN - CLAIMANT MAKES PLAN
  app.post( '/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/repayment-plan', (req, res) =>
  {
    req.session.data['validaionhigherthanjudgment'] = 'false';

    if(req.session.data['defendant'] == 'org' )
    {
        res.redirect( '../../task-list' );
    }
    else if (req.session.data['instalment-first-payment'] < 251 )
    {
      res.redirect('/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/approved');
    }
    else if (req.session.data['instalment-first-payment'] == 300 )
    {
      req.session.data['validaionhigherthanjudgment'] = 'true';

      res.render( strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/repayment-plan' );
    }
    else
    {
      res.redirect('/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/court-offer');
    }

  })


  app.post( '/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/pay-by-set-date', (req, res) => {

    if (req.session.data['defendant'] == 'org' ) {
        res.redirect( '../../task-list' );
    } else if (req.session.data['set-year'] > 2018 ) {
      res.redirect('/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/approved');
    } else {
      res.redirect('/' + strPath + 'dashboard/claimant-response/admit-the-claim/task-list/counter-offer/court-date');
    }

  })


  app.post( '/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/repayment-plan', (req, res) => {

    if (req.session.data['defendant'] == 'org' ) {
        res.redirect( '../../task-list' );
    } else if (req.session.data['instalment-first-payment'] < 251 ) {
      res.redirect('/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/approved');
    } else {
      res.redirect('/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/court-offer');
    }

  })


  app.post( '/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/pay-by-set-date', (req, res) => {

    if (req.session.data['defendant'] == 'org' ) {

        if (req.session.data['return'] == 'less-than' ) {
          res.redirect( '../../../paid-what-owe-less-claim-amount/task-list' );
        } else {
          res.redirect( '../../task-list' );
        }
    } else if (req.session.data['set-year'] > 2018 ) {
      res.redirect('/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/approved');
    } else {
      res.redirect('/' + strPath + 'dashboard/claimant-response/part-admit/task-list/counter-offer/court-date');
    }
  })


  app.post( '/' + strPath + 'defendant/task-list/your-defence/paid-less', (req, res) => {

    if( req.session.data['defaultccj'] == 'true' )
    {
        res.redirect('/' + strPath + 'dashboard/applications-and-judgments/set-aside-default-ccj/task-list?how_much_paid=complete&');
    }
    else
    {
        if (req.session.data['owe-amount'] < 1500 ) {
          res.redirect('/' + strPath + 'defendant/task-list/your-defence/defence-message?radio_select_group2=Some_paid');
        } else {
          res.redirect('/' + strPath + 'defendant/task-list?radio_select_group2=amount_claimed&show_mediation=true');
        }
    }



  })

  app.post( '/' + strPath + 'defendant/task-list/your-details/date-of-birth', (req, res) => {

    if (req.session.data['year'] > 2000 ) {
      res.redirect('/' + strPath + 'defendant/task-list/your-details/under-18');
    } else if (req.session.data['year'] <= 2000 ) {
      res.redirect('/' + strPath + 'defendant/task-list/your-details/number');
    } else {
      res.render( strPath + 'defendant/task-list/your-details/date-of-birth');
    }

  })

  app.post( '/' + strPath + 'claimant/task-list/their-details/defendant-add', (req, res) => {

    if (req.body.addDefendant === undefined) {
      var defendants = req.session.data.defendants || [];
      var defendantNo = defendants.length + 1;
      var defendantName = (req.session.data['defendant_name']) ? req.session.data['defendant_name'] : ''
      var defendantNameBusiness = (req.session.data['defendant_business_name']) ? req.session.data['defendant_business_name'] : ''
      var defendantNameContact = (req.session.data['defendant-contact-name']) ? req.session.data['defendant-contact-name'] : ''
      var defendantAddress1 = (req.session.data['defendant_AddressLine1']) ? req.session.data['defendant_AddressLine1'] : '-'
      var defendantAddress2 = (req.session.data['defendant_AddressLine2']) ? req.session.data['defendant_AddressLine2'] : ''
      var defendantTown = (req.session.data['defendant_city']) ? req.session.data['defendant_city'] : ''
      var defendantPostcode = (req.session.data['defendant_Postcode']) ? req.session.data['defendant_Postcode'] : ''
      var defendantAddress = defendantAddress1 + ' ' + defendantAddress2 + ' ' + defendantTown + ' ' + defendantPostcode
      var defendantEmail = (req.session.data['defendant-email']) ? req.session.data['defendant-email'] : ''
      var defendantType = (req.session.data['defendant-type']) ? req.session.data['defendant-type'] : ''

      defendants.push({'defendantNo': defendantNo, 'defendantName': defendantName, 'defendantNameBusiness': defendantNameBusiness, 'defendantNameContact': defendantNameContact, 'defendantAddress': defendantAddress, 'defendantType': defendantType, 'defendantEmail': defendantEmail })
      req.session.data.defendants = defendants
      res.render(strPath + 'claimant/task-list/their-details/defendant-add' );

    } else if (req.body.addDefendant && req.body.addDefendant.toString() === 'yes') {
      req.session.data['defendant_name'] = req.session.data['defendant_business_name'] = req.session.data['defendant-contact-name'] = req.session.data['defendant_AddressLine1'] = req.session.data['defendant_AddressLine2'] = req.session.data['defendant_AddressLine3']  = req.session.data['addressSelect'] = req.session.data['defendant_city'] = req.session.data['defendant_Postcode'] = req.session.data['postcode'] = req.session.data['postcodeFinder'] = req.session.data['defendant_country'] = req.session.data['defendant-email'] = req.session.data['defendant-type'] = undefined;
      res.redirect('../their-details');
    } else {
      res.redirect('/' + strPath + 'claimant/task-list');
    }

  })




  app.post( '/' + strPath + 'defendant/task-list/hearing/support', (req, res) => {

    if ( !req.session.data['scenario'] ) {
      req.session.data['scenario'] = 1;
    }

    res.redirect('/' + strPath + 'defendant/task-list/hearing/court');

  })


  app.get('*/prototype-admin/view-data', function(req, res){
      res.render('prototype-admin/view-data', { data: JSON.stringify( req.session, null, 2) } )
  });

  app.post('/prototype-13/agreement/details-defendant', (req, res) => {
    setAgreementStateToDone(req, res, 'claim')

    res.redirect(agreementPage)
  })

  app.post('/prototype-13/agreement/agreed', (req, res) => {
    setAgreementStateToDone(req, res, 'agreement')

    res.redirect(agreementPage)
  })

  app.post('/prototype-13/agreement/terms-4', (req, res) => {
    setAgreementStateToDone(req, res, 'about_agreement')

    res.redirect(agreementPage)
  })

  app.post('/prototype-13/agreement/breached', (req, res) => {
    setAgreementStateToDone(req, res, 'broken_agreement')

    res.redirect(agreementPage)
  })

  const agreementPage2 = '/prototype-16/review-agreement';
  app.get(agreementPage2, (req, res) => {
    const cookie = getAgreementStateCookie(req)
    if (isEqual(cookie, defaultState())) {
    setAgreementStateCookie(res, defaultState())
  }

  cookie.allAccepted = cookie.agreement.status === 'Reviewed'
    && cookie.about_agreement.status === 'Reviewed' && cookie.broken_agreement.status === 'Reviewed'

  res.render('prototype-16/review-agreement', cookie)
  })


  let setAgreementStateToDone = function (req, res, field) {
    let cookie = getAgreementStateCookie(req)

    cookie[field] = {
      css_class: "done",
      status: "Reviewed"
    }

    setAgreementStateCookie(res, cookie, 'claim')
  }

  app.post('/prototype-18/agreement/details-defendant', (req, res) => {
    setAgreementStateToDone(req, res, 'claim')

  res.redirect(agreementPage)
  })

  app.post('/prototype-18/agreement/agreed', (req, res) => {
    setAgreementStateToDone(req, res, 'agreement')

  res.redirect(agreementPage)
  })

  app.post('/prototype-18/agreement/terms-4', (req, res) => {
    setAgreementStateToDone(req, res, 'about_agreement')

  res.redirect(agreementPage)
  })

  app.post('/prototype-18/agreement/breached', (req, res) => {
    setAgreementStateToDone(req, res, 'broken_agreement')

  res.redirect(agreementPage)
  })

  /*app.post('/prototype-18/resolve-early', (req, res) => {
    res.redirect(`/prototype-18/owe-nothing/index == 'true'}`)
  })*/

  app.post('/owe-nothing/aos', (req, res) => {
    const defendNow = req.query['defend-now'];
    const extraDays = req.body['radio-aos-group'];
    if (defendNow === 'true') {
      res.redirect(`/prototype-11/owe-nothing/defence?extra-days=${extraDays}`)
    } else {
      res.redirect(`/prototype-11/owe-nothing/offer?extra-days=${extraDays}`)
    }
  })

  app.get('/prototype-11/owe-nothing/offer', (req, res) => {
    res.render('prototype-11/owe-nothing/offer', {
      extraDays: req.query['extra-days']
    })
  })

  app.get('/prototype-11/owe-nothing/defence', (req, res) => {
    res.render('prototype-11/owe-nothing/defence', {
      extraDays: req.query['extra-days']
    })
  })

  app.post('/prototype-11/resolve-early', (req, res) => {
    res.redirect(`/prototype-11/owe-nothing/aos?defend-now=${req.body['radio-contact-group'] == 'true'}`)
  })

  app.post('/prototype-11/owe-nothing/aos', (req, res) => {
    const defendNow = req.query['defend-now'];
  const extraDays = req.body['radio-aos-group'];
  if (defendNow === 'true') {
    res.redirect(`/prototype-11/owe-nothing/defence?extra-days=${extraDays}`)
  } else {
    res.redirect(`/prototype-11/owe-nothing/offer?extra-days=${extraDays}`)
  }
  })

  app.get('/prototype-11/owe-nothing/offer', (req, res) => {
    res.render('prototype-11/owe-nothing/offer', {
    extraDays: req.query['extra-days']
  })
  })

  app.get('/prototype-11/owe-nothing/defence', (req, res) => {
    res.render('prototype-11/owe-nothing/defence', {
    extraDays: req.query['extra-days']
  })
  })

  app.post('/prototype-11/resolve-early', (req, res) => {
    res.redirect(`/prototype-11/owe-nothing/aos?defend-now=${req.body['radio-contact-group'] == 'true'}`)
  })

  app.post('/prototype-11/owe-nothing/aos', (req, res) => {
    const defendNow = req.query['defend-now'];
  const extraDays = req.body['radio-aos-group'];
  if (defendNow === 'true') {
    res.redirect('/prototype-11/owe-nothing/defence?extra-days=${extraDays}')
  } else {
    res.redirect('/prototype-11/owe-nothing/offer?extra-days=${extraDays}')
  }
  })

  app.get('/prototype-11/owe-nothing/offer', (req, res) => {
    res.render('prototype-11/owe-nothing/offer', {
    extraDays: req.query['extra-days']
  })
  })

  app.get('/prototype-11/owe-nothing/defence', (req, res) => {
    res.render('prototype-11/owe-nothing/defence', {
    extraDays: req.query['extra-days']
  })
  })

  function mockAddressesFor(postcode) {
    let addresses = []
    if (postcode && isValidPostcode(postcode)) {
      for (let i = 1; i <= 3; i++) {
        addresses.push({
          uprn: `1234567${i}`,
          formatted_address: `Flat ${i}\nRiverside Apartments\n66 Warwick Road\nLondon\n${postcode.toUpperCase()}`
        })
      }
    }
    return addresses
  }

  function isValidPostcode(postcode) {
    let postcodeLength = postcode.trim().replace(' ', '').length
    return postcodeLength > 5 && postcodeLength < 9
  }


  // Check your answers for 'Check eligibility, cost and time'
  app.get('*/task-list/eligibility/reason', function (req, res, next) {



    let eligibility = req.session.data.eligibility;
    if (eligibility === "-complete" ){
      res.redirect("../eligibility/check-your-answers");
    } else {
      next()
    }

  });

  module.exports = app

  // Check your answers for 'Read rules'
  app.get('*/task-list/read-rules', function (req, res, next) {



    let read_rules = req.session.data.read_rules;
    if (read_rules === "-complete" ){
      res.redirect("read-rules/check-your-answers");
    } else {
      next()
    }

  });
  module.exports = app

  // Check your answers for 'Read rules'
  app.get('*/task-list/resolve-dispute', function (req, res, next) {



    let resolve_dispute = req.session.data.resolve_dispute;
    if (resolve_dispute === "c-omplete" ){
      res.redirect("resolve-dispute/check-your-answers");
    } else {
      next()
    }

  });

  module.exports = app

  // Check your answers for 'Read rules'
  app.get('*/task-list/resolve-dispute', function (req, res, next) {



    let read_rules = req.session.data.read_rules;
    if (read_rules === "-complete" ){
      res.redirect("resolve-dispute/check-your-answers");
    } else {
      next()
    }

  });


  module.exports = app

  // Check your answers for 'Your details'
  app.get('*/task-list/your-details', function (req, res, next) {

    let your_details = req.session.data.your_details;
    if (your_details === "-complete" ){
      res.redirect("your-details/check-your-answers");
    } else {
      next()
    }

  });

  module.exports = app

  // Check your answers for 'Their details'
  app.get('*/task-list/their-details', function (req, res, next) {

    let their_details = req.session.data.their_details;
    if (their_details === "-complete" ){
      res.redirect("their-details/check-your-answers");
    } else {
      next()
    }

  });

  module.exports = app

  // Check your answers for 'Claim amount'
  app.get('*/task-list/claim-amount', function (req, res, next) {

    let claim_amount = req.session.data.claim_amount;
    if (claim_amount === "-complete" ){
      res.redirect("claim-amount/check-your-answers");
    } else {
      next()
    }

  });


  module.exports = app



  module.exports = app

  // Check your answers for 'Claim amount'
  app.get('*/task-list/your-details', function (req, res, next) {

    let confirm_details = req.session.data.confirm_details;
    if (confirm_details === "-complete" ){
      res.redirect("your-details/check-your-answers");
    } else {
      next()
    }

  });
  module.exports = app




  // Check your answers for 'Claim amount'
  app.get('*/task-list/settle-out-of-court', function (req, res, next) {

    let settle_out_of_court = req.session.data.settle_out_of_court;
    if (settle_out_of_court === "-complete" ){
      res.redirect("settle-out-of-court/check-your-answers");
    } else {
      next()
    }

  });


  // Check your answers for 'Claim amount'
  app.get('*/task-list/more-time-to-respond', function (req, res, next) {

    let more_time_to_respond = req.session.data.more_time_to_respond;
    if (more_time_to_respond === "-complete" ){
      res.redirect("more-time-to-respond/check-your-answers");
    } else {
      next()
    }

  });



  module.exports = app

  // Check your answers for 'Claim amount'
  /*app.get('*//*task-list/do-you-owe-money', function (req, res, next) {

    let do_you_owe_money = req.session.data.do_you_owe_money;
    if (do_you_owe_money === "complete-" ){
      res.redirect("do-you-owe-money/check-your-answers");
    } else {
      next()
    }

  });
  module.exports = app*/


  // Check your answers for 'Claim amount'
  /*app.get('*//*task-list/defence-options', function (req, res, next) {

    let defence_options = req.session.data.defence_options;
    if (defence_options === "complete-" ){
      res.redirect("do-you-owe-money/check-your-answers");
    } else {
      next()
    }

  });
  module.exports = app*/

  // Check your answers for 'Claim amount'
  app.get('*/task-list/mediation', function (req, res, next) {

    let mediation = req.session.data.mediation;
    if (mediation === "-complete" ){
      res.redirect("mediation/check-your-answers");
    } else {
      next()
    }

  });

  module.exports = app

  // Check your answers for 'Claim amount'
  /*app.get('*//*task-list/your-defence', function (req, res, next) {


    let your_defence = req.session.data.your_defence;
    if (your_defence === "complete-" ){
      res.redirect("your-defence/check-your-answers");
    } else {
      next()
    }

  });*/


  module.exports = app
  // Check your answers for 'Claim amount'
  app.get('*/task-list/owe-all', function (req, res, next) {


    let your_defence = req.session.data.owe_some;
    if (your_defence === "complete-" ){
      res.redirect("owe-all/check-your-answers");
    } else {
      next()
    }

  });


  module.exports = app
  // Check your answers for 'Claim amount'
  app.get('*/task-list/your-defence/partial', function (req, res, next) {


    let your_defence = req.session.data.your_defence;
    if (your_defence === "complete-" ){
      res.redirect("../your-defence/check-your-answers");

    } else {
      next()
    }

  });


  function clearReturnPageHandler (req, res, next) {
    delete req.session.data.return_page
    next()
  }

  app.post('*/check-your-answers', clearReturnPageHandler)
  app.get('*/check-your-answers', clearReturnPageHandler)
  app.post('*/check-check-and-send', clearReturnPageHandler)
  app.get('*/check-your-answers', clearReturnPageHandler)

  module.exports = app

}

