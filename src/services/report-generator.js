import { readFile } from 'fs'
import Charts from 'chart.js'
import { extractResponses } from './lib.js'
import { send } from './mail-to.js'
import { hemlRenderer } from './mail-renderer.js'
import { drawPieChart } from './chart-renderer.js'

const DEFINITION_FILE_PATH = "src/models/dictionary.json"
const SCORE_DEFINITION = {}

export class Report {

    #body = {}
    #scores = {}
    #responded_values = {}
    #definition = {}
    #demographic = {}
    #name = ''

    #email_body = ''
    #email_metadata = ''

    constructor(body) {
        this.#body = body
        this.extractValues()
    }

    async prepReport() {
        return await this.hemlEngine()
    }

    async hemlEngine() {
        var data = {}
        return await drawPieChart().then((pie) => {
            console.log(pie)
            data = {
                name: this.#name,
                scores: this.#scores,
                values: this.#responded_values,
                demographic: this.#demographic,
                pie: pie
            }
        }).then(async() => {
            var res = await hemlRenderer(data)
            if(res == undefined) {
                console.log('Email rendering failed.')
                return 0
            }
            this.#email_body = res.email_body
            this.#email_metadata = res.email_metadata
            console.log('📩 Preparing to send.')
        }).catch((error) => {
            console.log(error)
        })
        
        
    }

    //async
    async sendReport(address) {
        await send(address, this.#email_metadata, this.#email_body).then((res) => {
            console.log(res)
        })
    }
    
    generateCharts() {
        data = {
            datasets: [{

            }],
            labels: []
        }

        var spendingsCharts = new Charts(ctx, {
            type: 'pie',
            data: data,
            options: options
        })
    }

    /**
     * Values extraction from form
     */
    extractValues()  {
        this.#scores = this.extractCalculatedScores()
        this.#responded_values = this.extractRespondedValues()
        this.#demographic = this.extractDemographicValues()
        this.#name = this.#body[4].form_response.hidden.name || 0
    }

    extractDemographicValues() {
        var res = extractResponses(this.#body[4].form_response.answers)
        var arr = {}
        arr["age"] = res[2]
        arr["income"] = res[3]
        arr["employement"] = res[4]
        arr["edu_level"] = res[5]
        arr["savings"] = res[0]
        arr["afford_unexpected_expense"] = res[1]
        arr["loan"] = res[6]
        arr["loan_type"] = res[7] || 0
        arr["loan_service"] = res[8] || 0
        arr["state"] = res[9] || 0
        arr["city"] = res[10] || 0
        return arr
    }
    
    extractCalculatedScores() {
        var res = this.#body[4].form_response.hidden
        var arr = {}
        arr["groceries"] = parseInt(res.gr)
        arr["transport"] = parseInt(res.tr)
        arr["eat_out"] = parseInt(res.eo)
        arr["hobbies"] = parseInt(res.hl)
        return arr
    }

    extractRespondedValues() {
        var res = this.#body[4].form_response.hidden
        var arr = {}
        //arr["name"] = res.name || 0
        arr["transport"] = res.trt || 0
        arr["eat_out"] = parseInt(res.grt) || 0
        arr["hobbies"] = parseInt(res.ht) || 0
        arr["clothes"] = parseInt(res.lt) || 0
        return arr
    }
    
    get emailBody() { return this.#email_body }
    get scores() { return this.#scores }
    get body() { return this.#body[4].form_response.answers }
    get definition() { return this.#definition }
    get demographic() { return this.#demographic }
    get responsedVals() { return this.#responded_values }


    readDefinitionFile() {
        var json = {}
        readFile(DEFINITION_FILE_PATH, 'utf8', (err, content) => {
            if (err) {
                console.log('File read failed: ', err)
                return
            }
            try {
                //console.log(content)
                console.log("definition loaded" + content)
                return typeof(content)
            } catch(err) {
                console.log(err)
                return
            }
        })
    }
}