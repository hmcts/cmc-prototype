'use strict'

const express = require('express')
const isEqual = require('lodash.isequal')

let router = express.Router()

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

router.post('/prototype-16/agreement/details-defendant', (req, res) => {
  setAgreementStateToDone(req, res, 'claim')

res.redirect(agreementPage)
})

router.post('/prototype-16/agreement/agreed', (req, res) => {
  setAgreementStateToDone(req, res, 'agreement')

res.redirect(agreementPage)
})

router.post('/prototype-16/agreement/terms-4', (req, res) => {
  setAgreementStateToDone(req, res, 'about_agreement')

res.redirect(agreementPage)
})

router.post('/prototype-16/agreement/breached', (req, res) => {
  setAgreementStateToDone(req, res, 'broken_agreement')

res.redirect(agreementPage)
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
  res.redirect(`/prototype-11/owe-nothing/defence?extra-days=${extraDays}`)
} else {
  res.redirect(`/prototype-11/owe-nothing/offer?extra-days=${extraDays}`)
}
})

router.get('/prototype-15/owe-nothing/offer', (req, res) => {
  res.render('prototype-15/owe-nothing/offer', {
  extraDays: req.query['extra-days']
})
})

router.get('/prototype-15/owe-nothing/defence', (req, res) => {
  res.render('prototype-15/owe-nothing/defence', {
  extraDays: req.query['extra-days']
})
})

router.post('/prototype-15/resolve-early', (req, res) => {
  res.redirect(`/prototype-15/owe-nothing/aos?defend-now=${req.body['radio-contact-group'] == 'true'}`)
})

router.post('/prototype-15/owe-nothing/aos', (req, res) => {
  const defendNow = req.query['defend-now'];
const extraDays = req.body['radio-aos-group'];
if (defendNow === 'true') {
  res.redirect(`/prototype-15/owe-nothing/defence?extra-days=${extraDays}`)
} else {
  res.redirect(`/prototype-15/owe-nothing/offer?extra-days=${extraDays}`)
}
})

router.get('/prototype-15/owe-nothing/offer', (req, res) => {
  res.render('prototype-15/owe-nothing/offer', {
  extraDays: req.query['extra-days']
})
})

router.get('/prototype-15/owe-nothing/defence', (req, res) => {
  res.render('prototype-15/owe-nothing/defence', {
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

module.exports = router


// // Check your answers for 'Check eligibility, cost and time'
// router.get('/prototype-14/task-list/check_before_you_start/reason', function (req, res) {
//
//   console.log("check your answers");
//
//   var check_before_you_start = req.query.check_before_you_start;
//
//   if (check_before_you_start == "complete" ){
//
//     res.redirect("/prototype-14/task-list/check_before_you_start/check-your-answers" + res.locals.formQuery);
//
//   }
//
// });
