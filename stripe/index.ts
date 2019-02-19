import { CustomCors } from './lib/custom-cors';

const express = require('express');
const expApp = new express();
const customCors = new CustomCors();      
expApp.use(customCors.cors());
const fs = require('fs');
const yaml = require('js-yaml');

let keys = yaml.load(fs.readFileSync('keys.yaml'));
const stripe = require('stripe')(keys.keySecret); // from keys.yaml


// ////////////////////////////////////////////////
// point the webhook to a public eg: run node on D.O. http://45.55.61.163:8080/webHooks
const webHookApp = new express();
webHookApp.use(customCors.cors());
// Retrieve the raw body as a buffer and match all content types
webHookApp.use(require('body-parser').raw({type: '*/*'}));

const endpointSecret = 'whsec_OTl4uIs3JwBMLXfoH5U1lTU7RAS0kXib'; // should be in yaml

webHookApp.all('/webHooks', (req, res) => {
    console.info('req.headers ------------------------>', req.headers);

    let sig = req.headers["stripe-signature"];

    try {
        let event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.info('stripe.webhooks.constructEvent ------------------------', event); // just print events for now: but should be managed in FireBase - including brodcast to browser to notify user
        if (event.type === 'charge.succeeded') {
            console.info('***************************************************************************')
            console.info('Customer with the id: ' + event.data.object.customer + ' was successfully charged');
        } else if (event.type === 'charge.failed') {
            console.info('***************************************************************************')
            console.info('Customer with the id: ' + event.data.object.customer + ' was failed to charge');
        }
    }
    catch (err) {
        console.info('error -------------->', err);
        res.status(400).end();
    }
    res.json({received: true});
})
webHookApp.listen(8080);

// ////////////////////////////////////////////////
// 0 deploy to a DO instance so webhooks work as line 10
// 1 fix css so radio is aligned
// 2 use elements for credit card https://stripe.com/docs/stripe-js/elements/quickstart
// 3 create source f type cc https://stripe.com/docs/sources/cards
// 4 notice payment methods in stripe docs
// 5 some sources need to listen to connect to webhook event

const PORT = 8444;
expApp.use(require('body-parser').urlencoded({extended: false}));

// ////////////////////////////////////////////////
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
                amount: amount,
                description: 'Sample Charge',
                    currency: 'usd',
                    customer: customer.id
                }, function(err, charge) {
                   console.info('error', err, 'charge -->', charge);
                }
            )
        })
        .then(charge => { // or just return a message
            console.info('charge ----> ',charge);
            return res.redirect('/chargedPg');
        })
        .catch(error => console.info('error --------> ', error));
    console.info('result ---->', result);
});

// ////////////////////////////////////////////////
expApp.use(express.static('www'))
expApp.listen(PORT);
console.info(PORT);

