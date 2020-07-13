import pkg from 'nodemailer'
const { createTransport } = pkg

// Reroute mail to mailtrap.io

var transporter = {}

process.env.NODE_ENV === "development" ?
transporter = createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
}) : 
transporter = createTransport({
  host: process.env.HD_EMAIL_HOST,
  port: process.env.HD_EMAIL_PORT,
  auth: {
    user: process.env.HD_EMAIL_USER,
    pass: process.env.HD_EMAIL_PASS
  }
})


/**
 * send() will return a Promise.resolve() if successful and Promise.reject() otherwise.
 * @param {String} mail email adress of which the email will be sent to.
 * @param {JSON} metadata email metadata
 * @param {HTML} body html body of the email
 */
export function send(mail, metadata, body) {
  
  var mailOptions = {
    from: 'HalDuit <donotreply@halduit.com>',
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

