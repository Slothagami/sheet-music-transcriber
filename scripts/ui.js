window.addEventListener("load", start)

var notes, title, subtitle
function start() {
    navigator.clipboard.readText().then(data => {
        data = JSON.parse(data)
        notes = data.midi
        title = data.title
        subtitle = data.subtitle
        init()
    })
}

var margin, size, score, parser, elem = {}
var params = new URLSearchParams(location.search)
function init() {
    

    parser = new MIDIReader(notes, 168)
    score  = new ScoreGenerator(parser.score)

    // load params
    score.settings.title    = title    || params.get("title")    || ""
    score.settings.subtitle = subtitle || params.get("subtitle") || ""
    
    // set the menus to reflect the score's default settings 
    for(let param in score.settings) {
        let el = document.getElementById(param)
        if (el) {
            elem[param] = el
            elem[param].value = score.settings[param]
        }
    }
    
    // fill out key dropdown options lists
    fill_dropdown("key",            score.key_signatues)
    fill_dropdown("time_signature", score.time_signatures)

    // attach button functions
    set_button("#pdf-button", score.download_pdf)
    set_button("#svg-button", score.download_svg)

    requestAnimationFrame(update_params)

    // update the display after a change
    document.querySelectorAll("select, input").forEach(el => {
        el.addEventListener("change", update_params)
    })
}

function update_params() {
    // update the score to reflect the UI settings
    for(let param in elem) {
        score.settings[param] = elem[param].value
    }
    
    score.generate()
    // requestAnimationFrame(update_params)
}


function fill_dropdown(dropdown, options) {
    // add the dropdown options from the list
    options.forEach(key => {
        let op = document.createElement("option")
            op.value = key
            op.innerText = key

        elem[dropdown].appendChild(op)
    })
    
    // update its value again
    elem[dropdown].value = score.settings[dropdown]
}

function set_button(selector, func) {
    let btn = document.querySelector(selector)
    btn.addEventListener("click", func)
}
