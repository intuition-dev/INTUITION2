const express = require('express');
const exp = new express();
const fs = require('fs');
const yaml = require('js-yaml');
let keys = yaml.load(fs.readFileSync('keys.yaml'));
const stripe = require('stripe')(keys.keySecret);
const PORT = 8444;
exp.use(require('body-parser').urlencoded({ extended: false }));
exp.post('/api/charge', (req, res) => {
    let amount = 500;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken
    })
        .then(customer => stripe.charges.create({
        amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id
    }))
        .then(charge => res.send('/chargedPg'));
});
exp.use(express.static('www'));
exp.listen(PORT);
console.info(PORT);
