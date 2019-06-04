"use strict";
import axios from 'axios';

export class EmailJs {
    send(email, from_name) {
        axios.post('https://api.emailjs.com/api/v1.0/email/send', {
            service_id: 'gmail',
            template_id: 'template_IWM2Sp3V',
            user_id: 'user_PFE8rcsDafCMuUvI1Yj11',
            template_params: {
                email: email,
                to_name: email,
                from_name: from_name,
                message_html: 'TEST MESSAGE FROM NODE BACKEND',
                email_to: 'liza.kislyakova@gmail.com'
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
