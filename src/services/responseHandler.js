import { readFile, writeFile } from 'fs/promises'
import { existsSync, unlinkSync } from 'fs'
import { Report } from './reportGenerator.js'

const TEMP_DIR = 'src/temp/'

export default async function handle(response) {

    // Checks if a record exist (the record comes from Form 2-5), else it is a new record.
    var record = response.form_response.hidden === undefined ? 
    TEMP_DIR + String(response.form_response.answers[0].text) + '.json' :
    TEMP_DIR + String(response.form_response.hidden.name) + '.json'
    
    try {
        if(existsSync(record)) {
            // If a record exists...
            console.log("Record exists. Appending: ")
            
            // ...read the file...
            readFile(record, {encoding: 'utf-8'})
            .then((content) => {
                const parsed = JSON.parse(content)

                // ...then append it to the read record from the file...
                parsed.push(response)

                console.log(parsed.length + " records stored.")

                // ...and if the response is complete (5 responses)
                if(parsed.length == 5) {
                    /**
                     * ...generate a report.
                     * Report Generation In Point
                     */
                    //DELETE
                    writeFile(record, JSON.stringify(parsed))
                    console.log("Response completed. Generating report.")
                    
                    // Sends the data to *reportGenerator.js*
                    var report = new Report(parsed)

                    report.prepReport()
                    .then(async (profile) => {
                        return await report.hemlEngine(profile)
                    }).then(() => {
                        return report.sendReport(report.emailAddress)
                        console.log('📩 Mail sending sequence.')
                    }).then(() => {
                        console.log('🗑  Cleanup')
                        //unlinkSync(record) //DELETE FILE
                    }).catch(console.log)

                } else {
                    // ...if the response is not complete, append the response to a temporary file.
                    writeFile(record, JSON.stringify(parsed))
                }
            }).catch((e) => {throw e})
        } else {

            // If a record does not exist, create a new record.
            console.log("Creating new record.")
            record = TEMP_DIR + String(response.form_response.answers[0].text) + '.json'
            var newRecord = []
            newRecord.push(response)
            await writeFile(record, JSON.stringify(newRecord), 'utf-8')
            .then(() => { console.log('File saved.')})
            .catch((e) => {throw e})
        }
    } catch(e) {
        console.error(e)
    }
}