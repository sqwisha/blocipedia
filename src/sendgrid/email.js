const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  welcome(user) {
    const msg = {
      to: user.email,
      from: 'blocipedia@email.email',
      subject: 'Welcome to Blocipedia',
      content: [{
        type: 'text/plain',
        value: 'Thank you for signing up! Enjoy!'
      }]
    };
    sgMail.send(msg);
  },
  upgrade(user) {
    const msg = {
      to: user.email,
      from: 'blocipedia@email.email',
      subject: 'Blocipedia Membership Upgraded',
      content: [{
        type: 'text/plain',
        value: 'Woohoo! You\'re a Premium Member now! Enjoy new features like private wikis, favorites, and more!'
      }]
    };
    sgMail.send(msg);
  }
};
