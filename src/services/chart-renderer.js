import vega from 'vega'
import { writeFileSync } from 'fs'

export function drawPieChart() {
    var spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "width": 400,
        "height": 200,
        "padding": 5,
      
        "data": {
            "values": [
              {"category": "a", "value": 4},
              {"category": "b", "value": 6},
              {"category": "c", "value": 10},
              {"category": "d", "value": 3},
              {"category": "e", "value": 7},
              {"category": "f", "value": 8}
            ]
        },
      }
    
    var view = new vega.View(vega.parse(spec), {renderer: 'none'}).initialize()
    
    return new Promise((resolve, reject) => {
        view
            .toCanvas()
            .then((canvas) => {
                //console.log(canvas.toBuffer())
                resolve(canvas.toBuffer().toString("base64"))
                //writeFileSync('./test.png', canvas.toBuffer())
            })
            .catch((err) => {
                reject(err)
            })
    })
   

}

