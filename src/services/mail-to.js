import pkg from 'nodemailer'
const { createTransport } = pkg

var transporter = createTransport({
  host: process.env.MAILTRAP_HOST || 'smtp.mailtrap.io',
  port: process.env.MAILTRAP_PORT || 2525,
  auth: {
    user: process.env.MAILTRAP_USER || '46be50762b5c5f',
    pass: process.env.MAILTRAP_PASS || '2e7d93f73e0aad'
  }
});

/**
 * 
 * @param {String} mail email adress of which the email will be sent to.
 * @param {JSON} metadata email metadata
 * @param {HTML} body html body of the email
 */
export function send(mail, metadata, body) {
  
  var mailOptions = {
    from: 'HalDuit <hello@halduit.com>',
    to: mail,
    subject: metadata.subject,
    text: 'View online version',
    html: `${body}`
  }

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function(error, info) {
      console.log('📤 Sending email to ', mail)
      console.log('\tEmail Subject: ', mailOptions.subject )
      if(error) {
        return reject(error)
      } else {
        return resolve('✅ Email sent => ' + info.response)
      }
    })
  })
  
}

