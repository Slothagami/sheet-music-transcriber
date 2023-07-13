window.addEventListener("load", init)

const score = {
    title:    "BRAND NEW WORLD",
    subtitle: "One Piece",
    artist:   "Symphoniac\nMagical Piano\nBlake Woolley",
    bpm:      160,
    key:      "Eb",

    treble: [
        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        // {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},
        
        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        // {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},

        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        // {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},

        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["e/5","g/5","c/6"], duration: "q"},
        // {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/5"], duration: "8"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["e/5"], duration: "8"},
    ],
    bass: [
        {keys: ["e/2","e/3"], duration: "8"},
        
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
