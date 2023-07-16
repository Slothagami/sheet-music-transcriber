window.addEventListener("load", init)

const score = {
    title:    "BRAND NEW WORLD",
    subtitle: "One Piece",
    artist:   "Symphoniac\nMagical Piano\nBlake Woolley",
    bpm:      160,
    key:      "Eb",
    time_signature: "none",

    treble: [
        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},
        
        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},

        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","g/5"], duration: "8"},
        {keys: ["b/4","e/5"], duration: "q"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["b/4","f/5"], duration: "8"},
        {keys: ["b/4","g/5"], duration: "8"},

        {keys: ["b/4"], duration: "qr"},
        {keys: ["b/4","e/5"], duration: "8"},
        {keys: ["e/5","g/5","c/6"], duration: "q"},
        {keys: ["b/5"], duration: "8"},
        {keys: ["g/5"], duration: "8"},
        {keys: ["e/5"], duration: "8"},
    ],
    bass: [
        {keys: ["e/2","e/3"], duration: "8"},
        [
            {keys: ["e/2","e/3"], duration: "qd"},
            {keys: ["e/2","e/3"], duration: "qd"},
            {keys: ["e/2","e/3"], duration: "16"},
        ],
        {keys: ["e/3"], duration: "16r"},

        {keys: ["d/2","d/3"], duration: "8"},
        [
            {keys: ["d/2","d/3"], duration: "qd"},
            {keys: ["d/2","d/3"], duration: "qd"},
            {keys: ["d/2","d/3"], duration: "16"},
        ],
        {keys: ["d/2"], duration: "16r"},

        {keys: ["c/2","c/3"], duration: "8"},
        [
            {keys: ["c/2","c/3"], duration: "qd"},
            {keys: ["c/2","c/3"], duration: "qd"},
            {keys: ["c/2","c/3"], duration: "16"},
        ],
        {keys: ["c/2"], duration: "16r"},

        {keys: ["b/1","b/2"], duration: "qd"},
        [
            {keys: ["e/2","b/2"], duration: "8"},
            {keys: ["e/2","b/2"], duration: "h"},
        ]
    ]
}

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
    
    // setup
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
