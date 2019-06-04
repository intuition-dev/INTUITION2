"use strict";
import axios from 'axios';

export class EmailJs {
    send(email, emailjsService_id, emailjsTemplate_id, emailjsUser_id, msg) {
        axios.post('https://api.emailjs.com/api/v1.0/email/send', {
                service_id: emailjsService_id, // gmail
                template_id: emailjsTemplate_id, // template_IWM2Sp3V
                user_id: emailjsUser_id, // user_PFE8rcsDafCMuUvI1Yj11
                template_params: {
                    to_name: email,
                    message_html: msg,
                    email_to: email
                }
            })
            .then(res => {
                console.info('Email has been sent. Result', res);
            })
            .catch(err => {
                console.info('Email has not been sent. Erro', err);
            });
    };
}
module.exports = {
    EmailJs
};
