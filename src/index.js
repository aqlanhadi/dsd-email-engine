require('dotenv').config()

// require express & body-parser
const express = require('express')
const bodyParser = require('body-parser')

// require fs to write log
const fs = require('fs')

// import custom modules
const mailTo = require('./services/mail-to')

// initialize express & define a port
const app = express()
const PORT = process.env.PORT

// use body-parser's JSON parse in express
app.use(bodyParser.json())

// route for listening to webhook
app.post('/hook', (req, res) => {
  console.log(`🛬 received a response.`)

  var resId = String(req.body.event_id)
  var file = 'models/' + resId.substr(0,6) + '.json'

  try {
    if(fs.existsSync(file)) {
      console.log('File exists, appending current response')
      fs.readFile(file, 'utf8', (err, json) => {
        if(err) {
          console.log('Read failed: ', err)
          return
        }
        try {
          const parsed = JSON.parse(json)
          parsed.push(req.body)
          fs.writeFile(file, JSON.stringify(parsed), (err) => {if (err) throw err})
          
          if(parsed.length == 4) {
            //generate report --build
          } else if(parsed.length > 4) {
            //??
          } else {}

        } catch(err) {
          console.log(err)
        }
      })
    } else {
      var responseArr = []
      responseArr.push(req.body)
      fs.writeFile(file, JSON.stringify(responseArr), 'utf8', (err) => {
        if (err) throw err
        console.log('File saved.')
      })
    }
  } catch(err) {
    console.log(err)
  }

  // var email_address = req.body.form_response.answers[1].text // get email from webhook
  // console.log('preparing to mail ' + email_address)
  // mailTo.address(email_address, 'Test') // @params body -> pass dynamic html
  res.status(200).end() // send status 200 to typeform
})

// start express on PORT
app.listen(PORT, () => console.log(`🚀 Server listening on port ${PORT}`))