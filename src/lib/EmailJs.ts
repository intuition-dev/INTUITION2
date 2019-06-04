"use strict";
// import axios from 'axios';

export class EmailJs {
    send(email, title, msg) {
        console.info('Sending message to: ', email, title, msg);
    };
}
module.exports = {
    EmailJs
};
