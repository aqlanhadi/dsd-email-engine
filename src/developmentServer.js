// Load credentials
process.env.NODE_ENV = 'development'

import dotenv from 'dotenv'
const keys = dotenv.config()
if(keys.error) { 
    throw keys.error
}

import { readFile } from 'fs'
import { Report } from './services/reportGenerator.js'

//actual request for response (req) is stored as req.body
var file = 'src/temp/testResponse.json'

readFile(file, 'utf8', (err, content) => {
    if(err) {
        console.log('File read failed: ', err)
        return
    }
    try {
        const response = JSON.parse(content)

        var report = new Report(response)

        report.prepReport()
        .then(async (profile) => {
            return await report.hemlEngine(profile)
        }).then(() => {
            return report.sendReport(report.emailAddress)
            console.log('📩 Mail sending sequence.')
        }).then(() => {
            console.log('🗑  Cleanup')
        }).catch(console.log)

    } catch(err) {
        console.log(err)
    }
})