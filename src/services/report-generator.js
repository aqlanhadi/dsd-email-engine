import { readFile } from 'fs/promises'
import Charts from 'chart.js'
import { extractResponses } from './lib.js'
import { send } from './mail-to.js'
import { hemlRenderer } from './mail-renderer.js'
import { drawPieChart } from './chart-renderer.js'
import profiler from './profiler.js'

const DEFINITION_FILE_PATH = "src/models/dictionary.json"
const PROFILE_DEF = 'src/models/profiles.json'
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
        return await profiler(this.#scores, this.#demographic.income, this.#demographic.loan_service)
    }

    async hemlEngine(profileData) {
        var data = {
            name: this.#name,
            breakdown: null,
            profile_meta: null,
            scores: this.#scores,
            values: this.#responded_values,
            demographic: this.#demographic,
            pie: null
        }

        return await readFile(PROFILE_DEF, {encoding: 'utf-8'}).then((definition) => {
            var parsed = JSON.parse(definition)
            var profile = parsed[profileData.profile - 1]
            data.profile_meta = profile
        }).then(async () => {
            data.pie = await drawPieChart(this.#responded_values)
        }).then(async () => {
            data.breakdown = await this.expenditureBreakdowns()
        }).then(async () => {
            data = Object.assign({}, data, profileData)
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

    async expenditureBreakdowns() {
        return new Promise((res, rej) => {
            try {
                var values = this.#responded_values
                var budget = 2000
                var budget_left = budget
                var breakdown = {}
                Object.keys(values).forEach((item, i) => {
                    let pc = values[item]/budget
                    budget_left -= values[item]
                    breakdown[item] = pc * 100
                })
                res(breakdown)
            } catch(e) {
                rej(e)
            }
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
        //arr["transport"] = res.trt || 0
        let calcTransport = (val) => {
            if(val === "less than RM10") return 10
            else if(val === "RM 10-50") return 50
            else if(val === "more than RM50") return 100
            else return 150
        }
        arr["transport"] = calcTransport(res.trt) || 0
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
}