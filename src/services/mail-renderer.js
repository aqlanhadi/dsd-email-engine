import heml from 'heml'
import { base64_encode } from './lib.js'
import { drawPieChart } from './chart-renderer.js'

/**
 * DEV: Promise 1
 * returns a promide of HTML Body
 * @param {Array} data dictionary for email rendering
 */
export async function hemlRenderer(data) {
    console.log('🖋 Writing email...')
    const op = {
        validate: 'soft',
        cheerio: {},
        juice: {},
        beautify: {},
        elements: []
    }

    return await heml(`
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
                    <column>
                        <img width="50px" src="data:image/png;base64, ${base64_encode(process.env.PWD + '/src/assets/img/logo_1.png')}"/> 
                    </column>
                </row>
                <br>
                <row>
                    <column>
                        <p>Hi ${data.name},</p>
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
                    <column>
                        <img width="400px" src="data:image/png;base64, ${data.pie}"/> 
                    </column>
                    <column>
                        <p>Savings</p>
                        <p>Eating Out</p>
                        <p>Hobbies</p>
                        <p>Clothings</p>
                        <p>Transportations</p>
                    </column>
                </row>
                <row>
                    <column>
                        <h5 class="text-muted">Demographic Average</h5>
                        <p>Among those who responded to our questions, and are living in $/{location}, aged $/{age} and has an income of $/{income_range}, you ranked $/{level} in the following categories</p>
                    </column>
                </row>
                <row>
                    <column>
                        $/{ranks}
                    </column>
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
                            <li>Groceries: ${data.scores.groceries}</li>
                            <li>Transport: ${data.scores.transport}</li>
                            <li>Eat Out: ${data.scores.eat_out}</li>
                            <li>Hobbies/Lifestyle: ${data.scores.hobbies}</li>
                        </ul>
                    </column>
                    <column>
                        <h2>Expenses</h2>
                        <ul>
                            <li>Transport: ${data.values.transport}</li>
                            <li>Eat Out: ${data.values.eat_out}</li>
                            <li>Hobbies: ${data.values.hobbies}</li>
                            <li>Clothes: ${data.values.clothes}</li>
                        </ul>
                    </column>
                    <column>
                        <h2>Demographics</h2>
                        <ul>
                            <li>Age: ${data.demographic.age}</li>
                            <li>Income: ${data.demographic.income}</li>
                            <li>Employment: ${data.demographic.employement}</li>
                            <li>Education Level: ${data.demographic.edu_level}</li>
                            <li>Savings: ${data.demographic.savings}</li>
                            <li>Can Afford RM1000 Expense?: ${data.demographic.afford_unexpected_expense}</li>
                            <li>Have Loan?: ${data.demographic.loan}</li>
                            <li>Loan Type: ${data.demographic.loan_type}</li>
                            <li>Servicing Cost: ${data.demographic.loan_service}</li>
                            <li>State: ${data.demographic.state}</li>
                            <li>City: ${data.demographic.city}</li>
                        </ul>
                    </column>
                </row>
            </container>
        </body>
    </heml>
    `, op)
    .then(({ html, metadata, errors }) => {
        try {
            console.log("📩 Email ready.")
            return ({
                email_body: html,
                email_metadata: metadata
            })
        } catch(err) {
            throw err
        }
    })
}