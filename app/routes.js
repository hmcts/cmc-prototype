'use strict'

const express = require('express')
const isEqual = require('lodash.isequal')

let router = express.Router()


router.all('/*', (req, res, next) => {
  console.log(`${req.method} ${req.url} ${JSON.stringify(req.session.data)}`)
  next()
})

// Route index page
router.get('/', function (req, res) {
  res.render('index')
})
router.post('/', function (req, res) {
  res.clearCookie(stateCookieName)
  res.render('index')
})

// add your routes here
router.get('/postcode', function (req, res, next) {
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
router.get(agreementPage, (req, res) => {
  const cookie = getAgreementStateCookie(req)
  if (isEqual(cookie, defaultState())) {
    setAgreementStateCookie(res, defaultState())
  }

  cookie.allAccepted = cookie.agreement.status === 'Reviewed'
    && cookie.about_agreement.status === 'Reviewed' && cookie.broken_agreement.status === 'Reviewed'

  res.render('prototype-13/review-agreement', cookie)
})

router.post('/prototype-13/agreement/details-defendant', (req, res) => {
  setAgreementStateToDone(req, res, 'claim')

  res.redirect(agreementPage)
})

router.post('/prototype-13/agreement/agreed', (req, res) => {
  setAgreementStateToDone(req, res, 'agreement')

  res.redirect(agreementPage)
})

router.post('/prototype-13/agreement/terms-4', (req, res) => {
  setAgreementStateToDone(req, res, 'about_agreement')

  res.redirect(agreementPage)
})

router.post('/prototype-13/agreement/breached', (req, res) => {
  setAgreementStateToDone(req, res, 'broken_agreement')

  res.redirect(agreementPage)
})

const agreementPage2 = '/prototype-16/review-agreement';
router.get(agreementPage2, (req, res) => {
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

router.post('/prototype-18/agreement/details-defendant', (req, res) => {
  setAgreementStateToDone(req, res, 'claim')

res.redirect(agreementPage)
})

router.post('/prototype-18/agreement/agreed', (req, res) => {
  setAgreementStateToDone(req, res, 'agreement')

res.redirect(agreementPage)
})

router.post('/prototype-18/agreement/terms-4', (req, res) => {
  setAgreementStateToDone(req, res, 'about_agreement')

res.redirect(agreementPage)
})

router.post('/prototype-18/agreement/breached', (req, res) => {
  setAgreementStateToDone(req, res, 'broken_agreement')

res.redirect(agreementPage)
})

/*router.post('/prototype-18/resolve-early', (req, res) => {
  res.redirect(`/prototype-18/owe-nothing/index == 'true'}`)
})*/

router.post('/owe-nothing/aos', (req, res) => {
  const defendNow = req.query['defend-now'];
  const extraDays = req.body['radio-aos-group'];
  if (defendNow === 'true') {
    res.redirect(`/prototype-11/owe-nothing/defence?extra-days=${extraDays}`)
  } else {
    res.redirect(`/prototype-11/owe-nothing/offer?extra-days=${extraDays}`)
  }
})

router.get('/prototype-11/owe-nothing/offer', (req, res) => {
  res.render('prototype-11/owe-nothing/offer', {
    extraDays: req.query['extra-days']
  })
})

router.get('/prototype-11/owe-nothing/defence', (req, res) => {
  res.render('prototype-11/owe-nothing/defence', {
    extraDays: req.query['extra-days']
  })
})

router.post('/prototype-11/resolve-early', (req, res) => {
  res.redirect(`/prototype-11/owe-nothing/aos?defend-now=${req.body['radio-contact-group'] == 'true'}`)
})

router.post('/prototype-11/owe-nothing/aos', (req, res) => {
  const defendNow = req.query['defend-now'];
const extraDays = req.body['radio-aos-group'];
if (defendNow === 'true') {
  res.redirect(`/prototype-11/owe-nothing/defence?extra-days=${extraDays}`)
} else {
  res.redirect(`/prototype-11/owe-nothing/offer?extra-days=${extraDays}`)
}
})

router.get('/prototype-11/owe-nothing/offer', (req, res) => {
  res.render('prototype-11/owe-nothing/offer', {
  extraDays: req.query['extra-days']
})
})

router.get('/prototype-11/owe-nothing/defence', (req, res) => {
  res.render('prototype-11/owe-nothing/defence', {
  extraDays: req.query['extra-days']
})
})

router.post('/prototype-11/resolve-early', (req, res) => {
  res.redirect(`/prototype-11/owe-nothing/aos?defend-now=${req.body['radio-contact-group'] == 'true'}`)
})

router.post('/prototype-11/owe-nothing/aos', (req, res) => {
  const defendNow = req.query['defend-now'];
const extraDays = req.body['radio-aos-group'];
if (defendNow === 'true') {
  res.redirect('/prototype-11/owe-nothing/defence?extra-days=${extraDays}')
} else {
  res.redirect('/prototype-11/owe-nothing/offer?extra-days=${extraDays}')
}
})

router.get('/prototype-11/owe-nothing/offer', (req, res) => {
  res.render('prototype-11/owe-nothing/offer', {
  extraDays: req.query['extra-days']
})
})

router.get('/prototype-11/owe-nothing/defence', (req, res) => {
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
router.get('*/task-list/eligibility/reason', function (req, res, next) {



  let eligibility = req.session.data.eligibility;
  if (eligibility === "complete" ){
    res.redirect("../eligibility/check-your-answers");
  } else {
    next()
  }

});

module.exports = router

// Check your answers for 'Read rules'
router.get('*/task-list/read-rules', function (req, res, next) {



  let read_rules = req.session.data.read_rules;
  if (read_rules === "complete" ){
    res.redirect("read-rules/check-your-answers");
  } else {
    next()
  }

});
module.exports = router

// Check your answers for 'Read rules'
router.get('*/task-list/resolve-dispute', function (req, res, next) {



  let resolve_dispute = req.session.data.resolve_dispute;
  if (resolve_dispute === "complete" ){
    res.redirect("resolve-dispute/check-your-answers");
  } else {
    next()
  }

});

module.exports = router

// Check your answers for 'Read rules'
router.get('*/task-list/resolve-dispute', function (req, res, next) {



  let read_rules = req.session.data.read_rules;
  if (read_rules === "complete" ){
    res.redirect("resolve-dispute/check-your-answers");
  } else {
    next()
  }

});


module.exports = router

// Check your answers for 'Completing your claim'
router.get('*/task-list/completing-your-claim', function (req, res, next) {

  let completing_your_claim = req.session.data.completing_your_claim;
  if (completing_your_claim === "complete" ){
    res.redirect("completing-your-claim/check-your-answers");
  } else {
    next()
  }

});
module.exports = router

// Check your answers for 'Your details'
router.get('*/task-list/your-details', function (req, res, next) {

  let your_details = req.session.data.your_details;
  if (your_details === "complete" ){
    res.redirect("your-details/check-your-answers");
  } else {
    next()
  }

});

module.exports = router

// Check your answers for 'Their details'
router.get('*/task-list/their-details', function (req, res, next) {

  let their_details = req.session.data.their_details;
  if (their_details === "complete" ){
    res.redirect("their-details/check-your-answers");
  } else {
    next()
  }

});

module.exports = router

// Check your answers for 'Claim amount'
router.get('*/task-list/claim-amount', function (req, res, next) {

  let claim_amount = req.session.data.claim_amount;
  if (claim_amount === "complete" ){
    res.redirect("claim-amount/check-your-answers");
  } else {
    next()
  }

});


module.exports = router

// Check your answers for 'Claim details'
router.get('*/task-list/claim-details', function (req, res, next) {

  let claim_details = req.session.data.claim_details;
  if (claim_details === "complete" ){
    res.redirect("claim-details/check-your-answers");
  } else {
    next()
  }

});

module.exports = router

// Check your answers for 'Claim amount'
router.get('*/task-list/your-details', function (req, res, next) {

  let confirm_details = req.session.data.confirm_details;
  if (confirm_details === "complete" ){
    res.redirect("your-details/check-your-answers");
  } else {
    next()
  }

});
module.exports = router




// Check your answers for 'Claim amount'
router.get('*/task-list/settle-out-of-court', function (req, res, next) {

  let settle_out_of_court = req.session.data.settle_out_of_court;
  if (settle_out_of_court === "complete" ){
    res.redirect("settle-out-of-court/check-your-answers");
  } else {
    next()
  }

});


// Check your answers for 'Claim amount'
router.get('*/task-list/more-time-to-respond', function (req, res, next) {

  let more_time_to_respond = req.session.data.more_time_to_respond;
  if (more_time_to_respond === "complete" ){
    res.redirect("more-time-to-respond/check-your-answers");
  } else {
    next()
  }

});



module.exports = router

// Check your answers for 'Claim amount'
router.get('*/task-list/do-you-owe-money', function (req, res, next) {

  let do_you_owe_money = req.session.data.do_you_owe_money;
  if (do_you_owe_money === "complete" ){
    res.redirect("do-you-owe-money/check-your-answers");
  } else {
    next()
  }

});
module.exports = router


// Check your answers for 'Claim amount'
router.get('*/task-list/defence-options', function (req, res, next) {

  let defence_options = req.session.data.defence_options;
  if (defence_options === "complete" ){
    res.redirect("do-you-owe-money/check-your-answers");
  } else {
    next()
  }

});
module.exports = router

// Check your answers for 'Claim amount'
router.get('*/task-list/mediation', function (req, res, next) {

  let mediation = req.session.data.mediation;
  if (mediation === "complete" ){
    res.redirect("mediation");
  } else {
    next()
  }

});

module.exports = router

// Check your answers for 'Claim amount'
router.get('*/task-list/your-defence', function (req, res, next) {


  let your_defence = req.session.data.your_defence;
  if (your_defence === "complete" ){
    res.redirect("your-defence/check-your-answers");
  } else {
    next()
  }

});


module.exports = router
// Check your answers for 'Claim amount'
router.get('*/task-list/owe-all', function (req, res, next) {


  let your_defence = req.session.data.owe_some;
  if (your_defence === "complete" ){
    res.redirect("owe-all/check-your-answers");
  } else {
    next()
  }

});


module.exports = router
// Check your answers for 'Claim amount'
router.get('*/task-list/your-defence/partial', function (req, res, next) {


  let your_defence = req.session.data.your_defence;
  if (your_defence === "complete" ){
    res.redirect("../your-defence/check-your-answers");               

  } else {
    next()
  }

});

function clearReturnPageHandler (req, res, next) {
  delete req.session.data.return_page
  next()
}

router.post('*/check-your-answers', clearReturnPageHandler)
router.get('*/check-your-answers', clearReturnPageHandler)
router.post('*/check-check-and-send', clearReturnPageHandler)
router.get('*/check-your-answers', clearReturnPageHandler)

module.exports = router
