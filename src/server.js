import express from 'express'
import bodyParser from 'body-parser'
import handle from './services/responseHandler.js'

const server = express()
const PORT = process.env.PORT || 3000

server.use(bodyParser.json())

server.post('/hook', (request, response) => {
    console.log(`🛬 received a response.`)
    //console.log(request.body.form_response)
    //return
    handle(request.body)
    response.status(200).end()
})

server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`)
})