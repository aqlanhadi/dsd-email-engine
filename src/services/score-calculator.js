import { readFile } from 'fs/promises'

export default async function profiler(scores, values, income, loan) {
    

    scoreClassifier(scores)
    .then((scores) => {
        console.log("promised classifier" + scores)
    }).catch((e) => {
        console.error("scoreClassifier():")
    })

    var budget = 2000
    var budget_left = budget
    
    Object.keys(values).forEach((item, i) => {
        let pc = values[item]/budget
        budget_left -= values[item]
        console.log('Budget left after %s (%d): %d (%d%%)', item, values[item], budget_left, pc)
    })
}

async function scoreClassifier(scores) {
    var path_to_def = 'src/models/score-definition.json'
    try {
        readFile(path_to_def, 'utf-8', (err, res) => {
            if(err) {
                throw err
            }
            else {
                var data = JSON.parse(res.toString())
                var scoreArr = []
                data.some((category, cat_index) => {
                    //console.log("\tChecking in " + category.item)
                    category.scores.some((level, level_index) => {
                        //console.log("\t\tChecking level " + level.level)
                        if(scores[category.item] >= level.min && scores[category.item] <= level.max) {
                            //console.log("\t\t\t✅")
                            scoreArr.push({
                                category: category.item,
                                level: level.level
                            })
                            return true
                        }
                    })
                })
                return profileDecider(scoreArr)
            }
        })
    } catch(e) {
        rej(err)
    }
    
    
}

function profileDecider(scores) {
    /**
     * scores[] Array
     * 1. Groceries (scores[1]), scores[1].level returns its level
     * 2. Transport
     * 3. Eat Out
     * 4. Hobbies
     */

    var count = {'1': 0, '2': 0, '3': 0}
    //  Count min, med and max occurences
    scores.forEach((category, i) => {
        count[category.level] = (count[category.level] || 0) + 1;
    })

    //  Set default profile to highest
    var profile = 4

    if(level[1] >= 3) { // if there are more than 3 categories in minimum -> LEVEL 1 PROFILE
        //console.log("saver")
        profile = 1
    } else if (scores[2].level === 1 && scores[3].level === 1) { //if transport and eating out is minimum -> LEVEL 2 PROFILE
        //console.log("shopper")
        profile = 2
    } else if (count[1] === 2) { // if there's only 2 categories in minimum -> LEVEL 3 PROFILE
        //console.log("big spenders")
        profile = 3
    } else if (count[1] === 1) { // if there's only 1 categories in minimum -> LEVEL 4 PROFILE
        //console.log("debtors")
        profile = 4
    }
    return profile
}