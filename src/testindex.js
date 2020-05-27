import { readFile } from 'fs'
import { Report, generateReportFrom } from './services/report-generator.js'

//actual request for response (req) is stored as req.body
var file = './samplereq.json'

readFile(file, 'utf8', (err, content) => {
    if(err) {
        console.log('File read failed: ', err)
        return
    }
    try {
        const response = JSON.parse(content)
        //generateReportFrom(response)
        var report = new Report(response)
        report.prepReport()
        setTimeout(() => {
            report.sendReport('aqlanhadi@gmail.com')
        }, 10000)
        
    } catch(err) {
        console.log(err)
    }
})