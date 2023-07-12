window.addEventListener("load", init)

const score = [
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
]

var margin, size, generator
function init() {
    generator = new ScoreGenerator(score)

    margin = document.getElementById("margin")
    size   = document.getElementById("size")

    requestAnimationFrame(update_params)
}

function update_params() {
    // ScoreGenerator.settings.margin = parseFloat(margin.value)
    // console.log(parseFloat(margin.value), ScoreGenerator.settings.margin)

    // generator.generate()

    requestAnimationFrame(update_params)
}
