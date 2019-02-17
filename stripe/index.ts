

const express = require('express');
const expApp = new express();
const fs = require('fs');
const yaml = require('js-yaml');
// ////////////////////////////////////////////////
const webHookApp = new express();
webHookApp.all('/webHooks', (req, res) => {
   console.info('req.body ------> ', req.body)

});
webHookApp.listen(8080)

// ////////////////////////////////////////////////
let keys = yaml.load(fs.readFileSync('keys.yaml'));

const stripe = require('stripe')(keys.keySecret); // from keys.yaml

const PORT = 8444;
expApp.use(require('body-parser').urlencoded({extended: false}));

// ////////////////////////////////////////////////

// 
expApp.post('/post/charge', (req, res) => {
    console.info('req.body ------> ', req.body);
    let amount = 500;

    let result = stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken
        })
        .then(customer => {
            console.info('customer', customer);
            stripe.charges.create({
                amount,
                description: 'Sample Charge',
                    currency: 'usd',
                    customer: customer.id
                }
            )
        })
        .then(charge => { // or just return a message
            console.info('charge ----> ',charge);
            return res.redirect('/chargedPg');
        });
    console.info('result ---->', result);
});

// ////////////////////////////////////////////////
expApp.use(express.static('www'));
expApp.listen(PORT);
console.info(PORT);

