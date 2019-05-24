const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
  welcome(user) {
    const msg = {
      to: user.email,
      from: 'test@example.com',
      subject: 'Welcome to Blocipedia',
      text: 'Thank you for signing up',
      html: '<strong>Enjoy!</strong>'
    };
    sgMail.send(msg);
  }
};
