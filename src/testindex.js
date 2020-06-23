import dotenv from 'dotenv'
dotenv.config()
import { readFile } from 'fs'
import { Report } from './services/report-generator.js'

//actual request for response (req) is stored as req.body
var file = './samplereq.json'

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
        })
        .then(() => {
            return report.sendReport('aqlanhadi@gmail.com')
            console.log('📩 Mail sending sequence.')
        })
        .then(() => {
            console.log('🗑  Cleanup')
        }).catch(console.log)

    } catch(err) {
        console.log(err)
    }
})