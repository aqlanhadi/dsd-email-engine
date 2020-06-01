import pkg from 'nodemailer'
const { createTransport } = pkg

var transporter = createTransport({
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

/**
 * 
 * @param {String} mail email adress of which the email will be sent to.
 * @param {JSON} metadata email metadata
 * @param {HTML} body html body of the email
 */
export function send(mail, metadata, body) {
  console.log('Sending email to ', mail)
  console.log('Email Subject: ', metadata.subject )
  //console.log('Email Body: ', body )
  
  var mailOptions = {
    from: 'HalDuit <hello@halduit.com>',
    to: mail,
    subject: metadata.subject,
    text: 'View online version',
    html: `${body}`
  }

  transporter.sendMail(mailOptions, function(error, info) {
    if(error) {
      console.log(error)
    } else {
      console.log('Email sent => ' + info.response)
    }
  })
}

