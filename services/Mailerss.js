const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
  constructor({ subject, recipients }, content) {
    super();

    this.sgApi = sendgrid(keys.sendGridKey);
    this.from_email = new helper.Email('no-reply@emaily.com');
    this.subject = subject;
    this.body = new helper.Content('text/html', content);
    this.recipients = this.formatAddresses(recipients);

    
    //the Mail base class has functionality built into it and "addcontent()" is one of them 
    this.addContent(this.body);
    //this is a helper function here we are going to add ClickTracking (this is part of SendGrid tracking of personalized links to identify each user who clicks on a link) 
    this.addClickTracking();
    //this a helper function
    this.addRecipients();
  }
//Here we want to extract each recipients address and format it 
  formatAddresses(recipients) {
      return recipients.map(({ email }) => {
        return new helper.Email(email);
      });
  }
  addClickTracking() {
      const trackingSettings = new helper.TrackingSettings();
      const clickTracking = new helper.ClickTracking(true, true);

      trackingSettings.setClickTracking(clickTracking);
      this.addTrackingSettings(trackingSettings);
  }

  addRecipients () {
      const personalize = new helper.Personalization();

      this.recipients.forEach(recipient => {
        personalize.addTo(recipient);
      });
      this.addPersonalization(personalize);
  }

  async send() {
      const request = this.sgApi.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: this.toJSON()
      });

      const response = await this.sgApi.API(request);
      return response;
  }
}

module.exports = Mailer;