import vega from 'vega'
import { writeFileSync } from 'fs'

export function drawPieChart(values) {

    var spec = {
		"$schema": "https://vega.github.io/schema/vega/v5.json",
		"description": "A basic pie chart example.",
		"width": 200,
		"height": 200,
		"autosize": "none",
	  
		"signals": [
		  {"name": "startAngle", "value": 0},
		  {"name": "endAngle", "value": 6.29},
		  {"name": "padAngle", "value": 0},
		  {"name": "innerRadius", "value": 0},
		  {"name": "cornerRadius", "value": 0},
		  {"name": "sort", "value": false}
		],
	  
		"data": [
		  {
			"name": "table",
			"values": [],
			"transform": [
			  {
				"type": "pie",
				"field": "field",
				"startAngle": 0,
				"endAngle": 6.29,
				"sort": false
			  }
			]
		  }
		],
	  
		"scales": [
		  {
			"name": "color",
			"type": "ordinal",
			"domain": {"data": "table", "field": "id"},
			"range": {"scheme": "category20"}
		  }
		],
	  
		"marks": [
		  {
			"type": "arc",
			"from": {"data": "table"},
			"encode": {
			  "enter": {
				"fill": {"scale": "color", "field": "id"},
				"x": {"signal": "width / 2"},
				"y": {"signal": "height / 2"}
			  },
			  "update": {
				"startAngle": {"field": "startAngle"},
				"endAngle": {"field": "endAngle"},
				"padAngle": {"signal": "padAngle"},
				"innerRadius": {"signal": "innerRadius"},
				"outerRadius": {"signal": "width / 2"}
			  }
			}
		  }
		]
	  }

	Object.values(values).forEach((v, i) => {
		spec.data[0].values.push({
			"id": i,
			"field": v
		})
	})
    var view = new vega.View(vega.parse(spec), {renderer: 'none'}).initialize()
    
    return new Promise((resolve, reject) => {
        view
            .toCanvas()
            .then((canvas) => {
				//console.log(canvas.toBuffer().toString("base64"))
                resolve(canvas.toBuffer().toString("base64"))
                //writeFileSync('./test.png', canvas.toBuffer())
            })
            .catch((err) => {
                reject(err)
            })
    })
   

}