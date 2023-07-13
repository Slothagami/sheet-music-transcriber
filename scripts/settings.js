window.addEventListener("load", init)

const score = {
    title:    "BRAND NEW WORLD",
    subtitle: "One Piece",
    artist:   "Symphoniac\nMagical Piano\nBlake Woolley",
    bpm:      148,

    treble: [
        {keys: ["c/4"], duration: "q"},
        {keys: ["d/4"], duration: "q"},
        {keys: ["b/4"], duration: "qr"},
        {keys: ["c/4","e/4","g/4"], duration: "q"},

        {keys: ["c/4","g/4"], duration: "q"},
        {keys: ["d/4"], duration: "q"},
        {keys: ["b/4"], duration: "qr"},
        {keys: ["c/4","e/4","g/4"], duration: "q"},

        {keys: ["c/4","e/4","g/4"], duration: "q"},
        {keys: ["b/4"], duration: "qr"},
        {keys: ["d/4"], duration: "q"},
        {keys: ["c/4","g/4"], duration: "q"},
    ],
    bass: [
        {keys: ["c/2"], duration: "q"},
        {keys: ["d/2"], duration: "q"},
        {keys: ["b/2"], duration: "qr"},
        {keys: ["c/2","e/2","g/2"], duration: "q"},

        {keys: ["c/2","g/2"], duration: "q"},
        {keys: ["d/2"], duration: "q"},
        {keys: ["b/2"], duration: "qr"},
        {keys: ["c/2","e/2","g/2"], duration: "q"},

        {keys: ["c/2","e/2","g/2"], duration: "q"},
        {keys: ["b/2"], duration: "qr"},
        {keys: ["d/2"], duration: "q"},
        {keys: ["c/2","g/2"], duration: "q"},
    ]
}

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

    requestAnimationFrame(update_params)
}

function update_params() {
    for(let param in elem) {
        generator.settings[param] = elem[param].value
    }
    
    generator.generate()
    requestAnimationFrame(update_params)
}
