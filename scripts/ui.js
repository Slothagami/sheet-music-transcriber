window.addEventListener("load", init)

var margin, size, score, elem = {}
function init() {
    score = new ScoreGenerator(SCORE)
    
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
}

function update_params() {
    // update the score to reflect the UI settings
    for(let param in elem) {
        score.settings[param] = elem[param].value
    }
    
    score.generate()
    requestAnimationFrame(update_params)
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
