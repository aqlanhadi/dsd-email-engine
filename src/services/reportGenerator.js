/**
 * @author Aqlan Nor Azman
 * @description Report generation utility. Includes data extraction, HTML email preparation and sending mail sequence.
 */

import { readFile } from 'fs/promises'
import Charts from 'chart.js'
import { extractResponses, expenditureBreakdowns } from './lib.js'
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

    /**
     * @param {FormResponse} body accepts the parsed JSON data from temp response file.
     * @returns a promise when extraction is complete. Stores extracted values in class's hidden variables.
     */
    constructor(body) {
        this.#body = body
        this.extractValues()
    }

    /**
     * @description profiles a response.
     * @returns a promise when profiler is complete.
     * Refer *models/profiles.json* for profile definition and *profiler.js* for profile decider.
     */
    async prepReport() {
        return await profiler(this.#scores, this.#demographic.income, this.#demographic.loan_service)
    }

    /**
     * 
     * @param {Array} profileData an array whic includes profile index and Debt-Income Ratio data
     * @description Compiles required data for HTML-Email generation.
     */
    async hemlEngine(profileData) {
        var data = {                            // DATA PASSED FOR HTML RENDERING:
            name: this.#name,                   // Name of respondent
            email: this.#demographic.email,     // Email Address
            breakdown: null,                    // Expenditure breakdown, calculated
            profile_meta: null,                 // Profile definition, pulled from models/profiles.json [DEBUG] tips accessible on profile_meta.tips[0 || 1]
            scores: this.#scores,               // Scores for each category
            values: this.#responded_values,     // [DEBUG] All responded values
            demographic: this.#demographic,     // Demographic data
            pie: null                           // Pie chart image in Base64 encoding
            // Appended later
            //      profile: 0,
            //      incomeRatio: 0,
            //      debtRatio: 0,
            //      dirHealth: ''
        }

        // Read profile definition file, and extracts the profile based on the received profiler index.
        return await readFile(PROFILE_DEF, {encoding: 'utf-8'}).then((definition) => {
            var parsed = JSON.parse(definition)
            var profile = parsed[profileData.profile - 1]
            data.profile_meta = profile
        }).then(async () => { 
            // Attempt to draw pie chart. [IMAGES ARE WIDELY UNSUPPORTED BY EMAIL CLIENTS]
            data.pie = await drawPieChart(this.#responded_values)
        }).then(async () => { 
            // Attempt to break expenditure down.
            data.breakdown = await expenditureBreakdowns(this.#responded_values)
        }).then(async () => { 
            // Render email
            data = Object.assign({}, data, profileData) // append profileData to data Array
            var res = await hemlRenderer(data)          // pass all data to *services/mail-renderer.js*,

            // if successful, res will be instated with an email object, ready to be sent.
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

    /**
     * 
     * @param {String} address the email address to send the email to.
     * @description Sends the rendered HTML email.
     */
    async sendReport(address) {
        await send(address, this.#email_metadata, this.#email_body).then((res) => {
            console.log(res)
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
        if(res[6] == "Yes") {
            arr["loan_type"] = res[7] || 0
            arr["loan_service"] = res[8] || 0
            arr["state"] = res[9] || 0
            arr["city"] = res[10] || 0
            arr["email"] = res[11] || "rejected@halduit.com"
        } else {
            arr["state"] = res[7] || 0
            arr["city"] = res[8] || 0
            arr["email"] = res[9] || "rejected@halduit.com"
        }
        
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
    
    // Getters
    get emailAddress() { return this.#demographic.email }
    get emailBody() { return this.#email_body }
    get scores() { return this.#scores }
    get body() { return this.#body[4].form_response.answers }
    get definition() { return this.#definition }
    get demographic() { return this.#demographic }
    get responsedVals() { return this.#responded_values }
}