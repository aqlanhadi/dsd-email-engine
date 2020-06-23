import heml from 'heml'
import { base64_encode } from './lib.js'

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
        <style>
            body {
                background: #EEE;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            }
            
            container {
                background: white;
                max-width: 700px;
                margin: 10px auto;
                padding: 10px 20px;
            }

            h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6 {
                margin-top: 0;
                margin-bottom: 0.5rem;
                font-weight: 500;
                line-height: 1.2;
            }
              
            h1, .h1 {
                font-size: calc(1.375rem + 1.5vw);
            }
              
            @media (min-width: 1200px) {
                h1, .h1 {
                  font-size: 2.5rem;
                }
            }
              
            h2, .h2 {
                font-size: calc(1.325rem + 0.9vw);
            }
              
            @media (min-width: 1200px) {
                h2, .h2 {
                  font-size: 2rem;
                }
            }
              
            h3, .h3 {
                font-size: calc(1.3rem + 0.6vw);
            }
              
            @media (min-width: 1200px) {
                h3, .h3 {
                  font-size: 1.75rem;
                }
            }
              
            h4, .h4 {
                font-size: calc(1.275rem + 0.3vw);
            }
              
            @media (min-width: 1200px) {
                h4, .h4 {
                  font-size: 1.5rem;
                }
            }
              
            h5, .h5 {
                font-size: 1.25rem;
            }
              
            h6, .h6 {
                font-size: 1rem;
            }
              
            p {
                margin-top: 0;
                margin-bottom: 1rem;
            }

            .text-muted {
                color: #6c757d !important;
            }

            .alert {
                position: relative;
                padding: 1rem 1rem;
                margin-bottom: 1rem;
                border: 1px solid transparent;
                border-radius: 0.25rem;
            }

            .alert-warning {
                color: #856404;
                background-color: #fff3cd;
                border-color: #ffeeba;
            }

            .card {
                position: relative;
                display: flex;
                flex-direction: column;
                min-width: 0;
                word-wrap: break-word;
                background-color: #fff;
                background-clip: border-box;
                border: 1px solid rgba(0, 0, 0, 0.125);
                border-radius: 0.25rem;
                margin-bottom: 10px;
            }

            .card-header {
                padding: 0.5rem 1rem;
                margin-bottom: 0;
                background-color: rgba(0, 0, 0, 0.03);
                border-bottom: 1px solid rgba(0, 0, 0, 0.125);
            }
                
            .card-header:first-child {
                border-radius: calc(0.25rem - 1px) calc(0.25rem - 1px) 0 0;
            }
                
            .card-header + .list-group .list-group-item:first-child {
                border-top: 0;
            }

            .card-title {
                margin-bottom: 0.5rem;
            }

            .card-body {
                flex: 1 1 auto;
                padding: 1rem 1rem;
            }

            .card-text:last-child {
                margin-bottom: 0;
            }
            
            .text-center {
                text-align: center !important;
            }
            
            .text-muted {
                color: #6c757d !important;
            }

            /*FONT AWESOME*/
            .fa,
            .fas,
            .far,
            .fal,
            .fad,
            .fab {
            -moz-osx-font-smoothing: grayscale;
            -webkit-font-smoothing: antialiased;
            display: inline-block;
            font-style: normal;
            font-variant: normal;
            text-rendering: auto;
            line-height: 1; }

            .fa-circle:before {
                content: "\f111"; }

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

            .dot1 {
                height: 15px;
                width: 15px;
                background-color: rgb(31, 119, 180);
                border-radius: 50%;
                display: inline-block;
            }
            
            fa {
              display: inline;
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

            <p>Hi ${data.name},</p>
            <p>Thanks for participating in our survey! Here is your financial summary.</p>
            <h2>You are a ${data.profile_meta.name}</h2>
            <p>${data.profile_meta.defined_by}</p>

            <br>
            <h5 class="text-muted"><u>What it means for your money</u></h5>
            <p>${data.profile_meta.means_for_money}</p>

            <row>
              <column>
                <div class="alert alert-warning text-center" role="alert">
                 All the values below are approximates based on your responses
                </div>
              </column>
              
            </row>
            
            <h5>Debt-Income Ratio</h5>
            <row>
              <column>
                <div class="card">
                  <div class="card-header text-center">${data.dirHealth}</div>
                  <div class="card-body text-center">
                    <p class="card-text">
                      <h4><small>INCOME</small>  ${data.incomeRatio} : ${data.debtRatio}  <small>DEBT</small></h4>
                    </p>
                  </div>
                </div>
              </column>
              
            </row>


                    <h5>Expenses</h5>
                    <h5 class="text-muted">Breakdown</h5>

            <row>
                <column large="8" small="4">
                    <img width="200px" src="data:image/png;base64, ${data.pie}"/> 
                </column>
                <column large="1" small="1">
                    <p class="dot" style="color: rgb(31, 119, 180);">&#9673;</p>
                    <p class="dot" style="color: rgb(174, 199, 232);">&#9673;</p>
                    <p class="dot" style="color: rgb(255, 127, 14);">&#9673;</p>
                    <p class="dot" style="color: rgb(255, 187, 120);">&#9673;</p>
                    <p class="dot" style="color: rgb(44, 160, 44);">&#9673;</p>
                </column>
                <column large="1" small="1">
                    <p style="color: green; font-weight: 700">+</p>
                    <p style="color: green; font-weight: 700">+</p>
                    <p style="color: red; font-weight: 700">-</p>
                    <p style="color: green; font-weight: 700">+</p>
                    <p style="color: red; font-weight: 700">-</p>

                </column>
                <column large="8" small="4">
                    <p>Savings</p>
                    <p>Eating Out</p>
                    <p>Hobbies</p>
                    <p>Clothings</p>
                    <p>Transportations</p>
                </column>
                <column large="2" small="2">
                    <p>10%</p>
                    <p>10%</p>
                    <p>10%</p>
                    <p>10%</p>
                    <p>10%</p>
                </column>
            </row>
            <!---
                    <h5 class="text-muted">Demographic Average</h5>
                    <p>Among those who responded to our questions, and are living in $/{location}, aged $/{age} and has an income of $/{income_range}, you ranked $/{level} in the following categories</p>

            <row>
                <column>
                  <div class="card">
                    <div class="card-body">
                      <h2 class="card-title text-center">Top 10%</h2>
                      <h6 class="card-text text-center">Most healthy DTI ratio</h6>
                    </div>
                  </div>
                </column>
                <column>
                  <div class="card">
                    <div class="card-body">
                      <h2 class="card-title text-center">Top 10%</h2>
                      <h6 class="card-text text-center">Most healthy DTI ratio</h6>
                    </div>
                  </div>
                </column>
            </row>
            -->
            <br>
            <hr>
            <h5 class="text-muted"><u>Things you can do as a ${data.profile_meta.name}</u></h4>
            <p>$/{tips}</p>
            <p>Follow us on Instagram and Twitter at @halduit for more financial tips and tricks! Share this questionnaires among your friends and family and find out how they rank against you!</p>
            <p>Happy saving!</p>
            <p class="text-muted"><small>- The HalDuit Team</small></p>

            <br></br>
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