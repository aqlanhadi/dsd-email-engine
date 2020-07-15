/**
 * @author Aqlan Nor Azman
 * @description Utility file for the application
 */

import { readFileSync } from 'fs'

var labels = []

/**
 * 
 * @param {Array} responses Array of responded values
 * @definition
 *  responses
 *      [1]: {Int} transport
 *      [2]: {Int} eating_out
 *      [3]: {Int} hobbies
 *      [4]: {Int} lifestyle
 */
export async function expenditureBreakdowns(responses) {
    return new Promise((res, rej) => {
        try {
            var values = responses
            var budget = 2000           // Change to their income
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

export async function spendingBreakdowns(values) {
    Object.keys(values).forEach((item, i) => {
        
    })
}

export function base64_encode(file) {
    var bmp = readFileSync(file)
    return new Buffer.from(bmp).toString('base64')
}

export function extractResponseBody(body) {
    var responses = []
    //var definitions = {}
    body.forEach((response, i) => {
        responses.push(extractResponses(response.form_response.answers))
        //definitions[i] = extractDefinition(response.form_response.definition.fields)
    })
    return responses
}

/**
 * @param {Array} answers under form_response.answers -> [...]
 */
export function extractResponses(answers) {
    var array = []
    answers.forEach((answer, i) => {
        try {
            if (answer.type == "text") array.push(answer.text)
            else if (answer.type == "choice") array.push(answer.choice.label)
            else if (answer.type == "number") array.push(answer.number)
            else if (answer.type == "boolean") array.push(answer.boolean)
            else if (answer.type == "choices") array.push(answer.choices.labels)
            else if (answer.type == "text") array.push(answer.text)
            else if (answer.type == "email") array.push(answer.email)
            else console.log("answer " + answer.type + " does not have a parsing sequence defined.")
        } catch(err) {
            console.log("extractResponses: ", err)
        }
    })
    return array
}

/**
 * Run only when needed to update definiions
 * @param {Array} fields 
 */
export function extractDefinition(fields) {
    var array = {}
    fields.forEach((question, i) => {
        if ("choices" in question) {
            var labelArr = {}
            question.choices.forEach((item, i) => {
                labelArr[item.label] = 0
            })
            array[i] = labelArr
        } else {
            array[i] = 0
        }
    })
    return array
}

export function extractHiddenFields(response) {
    
}

/**
 * 
 * @param {File} scoreDefiniion scores mapped to answer in (k, v)
 * @param {Array} answerMatrix user response
 */
export function scoreMatrix(scoreDefiniion, answerMatrix) {
    var grocery = answerMatrix[0]
    var transport = answerMatrix[1]
    var eatout = answerMatrix[2]
    var leisure = answerMatrix[3]
    var demographic = answerMatrix[4]
}