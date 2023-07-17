window.addEventListener("load", init)

const keys = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 
    'C#', 'F#',
    'Ab', 'Bb', 'Db', 'Eb', 'Gb'
]
const time_signatures = [
    "none",
    "C",   '4/4',  '3/4', 
    '2/4', '2/2',  '3/8', 
    '3/2', '4/8',  '4/2', 
    '6/8', '6/4',  '9/8', 
    '9/4', '12/8', '12/4'
]
var margin, size, generator, elem = {}
function init() {
    generator = new ScoreGenerator(score)
    
    for(let param in generator.settings) {
        let el = document.getElementById(param)
        if (el) {
            elem[param] = el
            elem[param].value = generator.settings[param]
        }
    }
    
    // fill out key dropdown options
    fill_dropdown("key", keys)
    fill_dropdown("time_signature", time_signatures)

    // attach button functions
    let pdf_button = document.querySelector("#pdf-button")
    let svg_button = document.querySelector("#svg-button")
    pdf_button.addEventListener("click", () => {
        generator.download_pdf(pdf_button)
    })
    svg_button.addEventListener("click", () => {
        generator.download_svg(svg_button)
    })

    requestAnimationFrame(update_params)
}

function update_params() {
    for(let param in elem) {
        generator.settings[param] = elem[param].value
    }
    
    generator.generate()
    requestAnimationFrame(update_params)
}


function fill_dropdown(dropdown, options) {
    options.forEach(key => {
        let op = document.createElement("option")
            op.value = key
            op.innerText = key

        elem[dropdown].appendChild(op)
    })
    // update its value again
    elem[dropdown].value = generator.settings[dropdown]
}
