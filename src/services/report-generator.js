import { readFile, writeFile } from 'fs'
import Charts from 'chart.js'
import { extractResponses, extractResponseBody, base64_encode } from './lib.js'
import { send } from './mail-to.js'
import heml from 'heml'
import mjml2html from 'mjml'

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

    prepReport() {
        this.hemlEngine()
    }

    hemlEngine() {
        const op = {
            validate: 'soft',
            cheerio: {},
            juice: {},
            beautify: {},
            elements: []
        }

        heml(`
        <heml>
            <head>
                <subject>Your Financial Report</subject>
                <preview>Your report is ready.</preview>
                <link href="https://fonts.googleapis.com/css2?family=Poppins&display=swap" rel="stylesheet">
                <style>
                    body {
                        background: #EEE;
                        font-family: 'Poppins', sans-serif;
                    }

                    container {
                        background: white;
                        max-width: 700px;
                        margin: 10px auto;
                        padding: 10px 20px;
                    }

                    hr {
                        border-color: #DDD;
                    }

                    button {
                        background: #333;
                        padding: 10px 20px;
                        margin: 10px 0;
                    }

                    column {
                        padding: 0 10px;
                    }

                    .text-muted {
                        text-transform: uppercase;
                        opacity: 0.5;
                    }
                </style>
            </head>
            <body>
                <container>
                    <row>
                        <img width="50px" src="data:image/png;base64, ${base64_encode(process.env.PWD + '/src/assets/img/logo_1.png')}"/>
                    </row>
                    <br>
                    <row>
                        <column>
                            <p>Hi ${this.#name},</p>
                            <p>Thanks for participating in our survey! Here is your financial summary.</p>
                            <h1>You are a $/{profile}</h1>
                            <p>$/{profile_desc}</p>
                        </column>
                    </row>
                    <row>
                        <column>
                            <h5 class="text-muted">What it means for your money</h5>
                            <p>$/{profile_money_insight}</p>
                        </column>
                    </row>
                    <hr>
                    <row>
                        <column>
                            <h4>DEBT-INCOME RATIO</h4>
                        </column>
                    </row>

                    <row>
                        <column>
                            <h4>EXPENSES</h4>
                            <h5 class="text-muted">Breakdown</h5>
                        </column>
                    </row>
                    <row>
                        <column>Chart</column>
                        <column>
                            <row>Savings</row>
                            <row>Eating Out</row>
                            <row>Hobbies</row>
                            <row>Clothings</row>
                            <row>Transportations</row>
                        </column>
                    </row>
                    <row>
                        <h5 class="text-muted">Demographic Average</h5>
                        <p>Among those who responded to our questions, and are living in $/{location}, aged $/{age} and has an income of $/{income_range}, you ranked $/{level} in the following categories</p>
                    </row>
                    <row>
                        $/{ranks}
                    </row>
                    <hr>
                    <h4>THINGS YOU CAN DO AS A $/{profile}</h4>
                    <p>$/{tips}</p>
                    <p>Follow us on Instagram and Twitter at @halduit for more financial tips and tricks! Share this questionnaires among your friends and family and find out how they rank against you!</p>
                    <p>Happy saving!</p>
                    <p>- The HalDuit Team</p>
                    <hr>
                    <row>
                        <column>
                            <h2>Scores</h2>
                            <ul>
                                <li>Groceries: ${this.#scores.groceries}</li>
                                <li>Transport: ${this.#scores.transport}</li>
                                <li>Eat Out: ${this.#scores.eat_out}</li>
                                <li>Hobbies/Lifestyle: ${this.#scores.hobbies}</li>
                            </ul>
                        </column>
                        <column>
                            <h2>Expenses</h2>
                            <ul>
                                <li>Transport: ${this.#responded_values.transport}</li>
                                <li>Eat Out: ${this.#responded_values.eat_out}</li>
                                <li>Hobbies: ${this.#responded_values.hobbies}</li>
                                <li>Clothes: ${this.#responded_values.clothes}</li>
                            </ul>
                        </column>
                        <column>
                            <h2>Demographics</h2>
                            <ul>
                                <li>Age: ${this.#demographic.age}</li>
                                <li>Income: ${this.#demographic.income}</li>
                                <li>Employment: ${this.#demographic.employement}</li>
                                <li>Education Level: ${this.#demographic.edu_level}</li>
                                <li>Savings: ${this.#demographic.savings}</li>
                                <li>Can Afford RM1000 Expense?: ${this.#demographic.afford_unexpected_expense}</li>
                                <li>Have Loan?: ${this.#demographic.loan}</li>
                                <li>Loan Type: ${this.#demographic.loan_type}</li>
                                <li>Servicing Cost: ${this.#demographic.loan_service}</li>
                                <li>State: ${this.#demographic.state}</li>
                                <li>City: ${this.#demographic.city}</li>
                            </ul>
                        </column>
                    </row>
                </container>
            </body>
        </heml>
        `, op)
        .then(({ html, metadata, errors }) => {
            console.log("Email built")
            console.log(metadata)
            this.#email_body = html
            this.#email_metadata = metadata
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

    sendReport(address) {
        send(address, this.#email_metadata, this.#email_body)
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
        //return {"hi": 0}
    }
}

export function generateReportFrom(body) {
    
    /*
    TODO
    1.  validate data
    2.  extract variables
    3.  perform calculations
    4.  send to heml engine
    5.  generate heml
    6.  pass result to mailer
    */

    var name = body[0].form_response.answers[0].text
    console.log(name + "'s responses:")

    var extracted = extractResponseBody(body)   //extracted [0] = responses [1] =def(off by default)

    

    //console.log(extracted)
    return
}