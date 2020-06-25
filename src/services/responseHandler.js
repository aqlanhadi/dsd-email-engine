import { readFile, writeFile } from 'fs/promises'
import { existsSync } from 'fs'

export default async function handle(response) {
    //var record = 'src/models/' + String(response.form_response.hidden.name) || String(response.form_response.answers[0].text) + '.json'
    var record = response.form_response.hidden === undefined ? 
    'src/models/' + String(response.form_response.answers[0].text) + '.json' :
    'src/models/' + String(response.form_response.hidden.name) + '.json'
    
    try {
        if(existsSync(record)) {
            console.log("Record exists. Appending: ")
            
            readFile(record, {encoding: 'utf-8'})
            .then((content) => {
                const parsed = JSON.parse(content)
                parsed.push(response)

                console.log(parsed.length + " records stored.")

                if(parsed.length == 5) {
                    /**
                     * Report Generation In Point
                     */
                    console.log("Response completed. Generating report.")
                } else {
                    writeFile(record, JSON.stringify(parsed))
                }
            }).catch((e) => {throw e})
        } else {
            console.log("Creating new record.")
            record = 'src/models/' + String(response.form_response.answers[0].text) + '.json'
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