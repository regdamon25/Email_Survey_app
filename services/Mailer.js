const sgMail = require('@sendgrid/mail');
const keys = require("../config/keys");

class Mailer {
    constructor({subject, recipients}, content){
        this.message = {
            to: recipients,
            from: 'no-reply@emaily.com',
            subject: subject,
            html: content,
            trackingSettings: {
                clickTracking: { enable: true }
            }
        };
        sgMail.setApiKey(keys.sendGridKey);
    }

    async send() {
        const response = await sgMail.sendMultiple(this.message);
        return response;
    }
}

module.exports = Mailer;