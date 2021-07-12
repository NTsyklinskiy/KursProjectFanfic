const nodemailer = require('nodemailer');

const sendEmail = async ({email, subject, url}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    // service: 'Gmail',
    ignoreTLS: false,
    secure: false,
    // secure: true,
    auth: {
      user: 'testspav4@gmail.com',
      pass: 'Max2005@)@!'
    }
  });

  const mailOptions = {
    from: 'Nikita Tsyklinskiy <ntsyklinskiy@gmail.com>',
    to: email,
    subject,
    html: `<a href="${url}">${url}</a>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;