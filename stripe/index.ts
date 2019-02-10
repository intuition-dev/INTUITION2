/*
declare var process: any
declare var console: Console
declare var __dirname: any
*/

const express = require('express')
const exp = new express()
const fs = require('fs')
const yaml = require('js-yaml')

// ////////////////////////////////////////////////
let keys = yaml.load(fs.readFileSync('keys.yaml'))

const stripe = require('stripe')(keys.keySecret) // from keys.yaml

const PORT = 8444
exp.use(require('body-parser').urlencoded({extended: false}))

// ////////////////////////////////////////////////
// https://stripe.com/docs/api/cards/create?lang=curl
// https://stripe.com/docs/charges
// https://stripe.com/docs/api/charges/create
// https://stripe.com/docs/payments/payment-intents/usage
// https://stackoverflow.com/questions/18374282/stripe-payment-save-token-and-customer-and-make-payment-later-from-token
// https://stripe.com/docs/saving-cards
// stripe capture
// 
exp.post('/post/charge', (req, res) => {
  let amount = 500;

  stripe.customers.create({
     email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer =>
    stripe.charges.create({
      amount,
      description: 'Sample Charge',
         currency: 'usd',
         customer: customer.id
    }))
  .then(charge => { // or just return a message
     console.log(charge)
     res.send('/chargedPg')
  })
})

// ////////////////////////////////////////////////
exp.use(express.static('www'))
exp.listen(PORT)
console.info(PORT)

