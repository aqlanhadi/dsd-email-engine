/**
 * @author Aqlan Nor Azman
 * @description This file initializes the server, with a webhook listener (/hook) that listens to Typeform API.
 * 
 */

// Load credentials
import dotenv from 'dotenv'
const keys = dotenv.config()
if(keys.error) { 
    throw keys.error
}

import express from 'express'
import bodyParser from 'body-parser'
import handle from './services/responseHandler.js'

const server = express()
const PORT = process.env.PORT || 3000

server.use(bodyParser.json())

server.post('/hook', (request, response) => {
    console.log(`🛬 received a response.`)

    // Goes to *services/responseHandler.js*
    handle(request.body)
    response.status(200).end()
})

server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`)
})