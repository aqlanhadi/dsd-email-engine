/**
 * @author Aqlan Nor Azman
 * @description Profiler
 */

import { readFile } from 'fs/promises'

const SCORE_DEF_FILE = 'src/models/scoreDefinition.json'

/**
 * Accepts scores from Typeform responses, as well as estimated income and loan to decide its financial profile.
 * @param {Array} scores Score array from extracted Typeform response.
 * @param {Double} income Income response from Typeform
 * @param {Double} loan Loan response from Typeform
 * @returns a response Array with profile index number, debt ratio in relation to income ratio and its Debt-Income Ratio health.
 */
export default async function profiler(scores, income, loan) {
    var response = {
        profile: 0,
        incomeRatio: 0,
        debtRatio: 0,
        dirHealth: ''
    }

    return await scoreClassifier(scores)
    .then(async (res) => {
        response.profile = await decider(res)
    }).then(async () => {

        //  Once a profile index is determined, return the response Array
        var res = debtIncomeRatio(income, loan)
        response.incomeRatio = res.incomeRatio
        response.debtRatio = res.debtRatio
        response.dirHealth = res.dirHealth
        console.log("👤 Response profiled.")
        return response
    })

}

function debtIncomeRatio(income, loan) {
    const INCOME_DEF = {
        'RM2,000 or less': 2000,
        'RM2,001-RM4,000': 4000,
        'RM4,001-RM6,000': 6000,
        'RM6,001-RM8,000': 8000,
        'More than RM8,000': 10000,
        'I prefer not to answer': -1
    }

    const LOAN_DEF = {
        'Lower than 20%': .1,
        '20%-40%': .3,
        '20%-40%': .7,
        'I prefer not to answer': -1
    }

    var debtRatio = LOAN_DEF[loan] * 100
    var incomeRatio = 100 - debtRatio
    var status = ''
    
    if (debtRatio < 30 ) status = 'Healthy'
    else if (debtRatio < 50) status = 'At Risk'
    else if (debtRatio < 100) status = 'Risky'
    else {
        incomeRatio = "Not Specified"
        debtRatio = "Not Specified"
        status = 'You did not specify your debt.'
    }

    return { debtRatio: debtRatio, incomeRatio: incomeRatio, dirHealth: status }
    console.log("Income %d : %d Debt", incomeRatio, debtRatio)
}

/**
 * @param {Array} scores An array of extracted category scores from Typeform responses.
 * @description Recieves scores, and sends the score level to a profile decider.
 * @returns An array with the category's score level.
 */
async function scoreClassifier(scores) {

    // Read the score definition file...
    return await readFile(SCORE_DEF_FILE, {encoding: 'utf-8'})
    .then((res) => {
        // ...and classify the scores to its respective 'levels', eg. High, Med or Low
        var data = JSON.parse(res.toString())
        var scoreArr = []
        data.some((category) => {
            // console.log("\tChecking in " + category.item)
            category.scores.some((level) => {
                // console.log("\t\tChecking level " + level.level)
                if(scores[category.item] >= level.min && scores[category.item] <= level.max) {
                    // console.log("\t\t\t✅")
                    scoreArr.push({
                        category: category.item,
                        level: level.level
                    })
                    return true
                }
            })
        })
        return scoreArr
    })
}

/**
 * 
 * @param {Array} scores 
 * @description Profile decider
 * @definition
 *  scores Array is addressed as below:
 *      index 1: Groceries
 *      index 2: Transport
 *      index 3: Eating Out
 *      index 4: Hobbies
 */
async function decider(scores) {
    return new Promise((res, rej) => {
        try {

            var count = {'1': 0, '2': 0, '3': 0}
            //  Count min, med and max occurences
            scores.forEach((category, i) => {
                count[category.level] = (count[category.level] || 0) + 1;
            })

            //  Set default profile to highest
            var profile = 4

            //  !!! This is where the profile gets decided. Change definitions here.

            if(count[1] >= 3) { // if there are more than 3 categories in minimum: LEVEL 1 PROFILE
                //console.log("saver")
                profile = 1
            } else if (scores[2].level === 1 && scores[3].level === 1) { //if transport and eating out is minimum -> LEVEL 2 PROFILE
                //console.log("shopper")
                profile = 2
            } else if (count[1] === 2) { // if there's only 2 categories in minimum: LEVEL 3 PROFILE
                //console.log("big spenders")
                profile = 3
            } else if (count[1] === 1) { // if there's only 1 categories in minimum: LEVEL 4 PROFILE
                //console.log("debtors")
                profile = 4
            }
            res(profile)
        } catch(e) {
            rej(e)
        }
    })
    
}