import pkg from 'nodemailer'
const { createTransport } = pkg

const MAIL_FROM = 'duitforall@gmail.com'
// const MAIL_FROM_PASS = 'futureready2020'

var transporter = createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "46be50762b5c5f",
    pass: "2e7d93f73e0aad"
  }
});

export function send(mail, metadata, body) {
  console.log('Sending email to ', mail)
  console.log('Email Subject: ', metadata.subject )
  //console.log('Email Body: ', body )

  var mailOptions = {
    from: 'HalDuit <hello@halduit.com>',
    to: mail,
    subject: metadata.subject,
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

