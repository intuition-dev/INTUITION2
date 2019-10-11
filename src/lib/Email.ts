// All rights reserved by MetaBake (INTUITION.DEV) | Cekvenich, licensed under LGPL 3.0

const superagent = require('superagent');
const logger = require('tracer').console()

export class Email {
    send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) {
        email = Buffer.from(email, 'base64').toString()
        console.log('email_to: ', email);
        superagent.post('https://api.emailjs.com/api/v1.0/email/send', {
                service_id: emailjsService_id,
                template_id: emailjsTemplate_id,
                user_id: emailjsUser_id,
                template_params: {
                    to_name: email,
                    message_html: msg,
                    email_to: email
                }
            })
            .then(res => {
                console.info('Email has been sent. ')
            })
            .catch(err => {
                logger.trace('send mail error: ', err)
            });
    }//()
    
}//class

module.exports = {
    Email
}
