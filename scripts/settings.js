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

    margin       = document.getElementById("margin")
    size         = document.getElementById("size")
    bar_margin   = document.getElementById("bmargin")
    stave_height = document.getElementById("stave_height")
    bars         = document.getElementById("bars")
    clef_width   = document.getElementById("clef_width")

    margin.value       = generator.settings.margin
    size.value         = generator.settings.font_size
    bar_margin.value   = generator.settings.bar_margin
    stave_height.value = generator.settings.stave_height
    bars.value         = generator.settings.row_bars
    clef_width.value   = generator.settings.clef_width

    requestAnimationFrame(update_params)
}

function update_params() {
    generator.settings.margin        = parseFloat(margin.value)
    generator.settings.font_size     = parseFloat(size.value)
    generator.settings.bar_margin    = parseFloat(bar_margin.value)
    generator.settings.stave_height  = parseFloat(stave_height.value)
    generator.settings.row_bars      = parseFloat(bars.value)
    generator.settings.clef_width    = parseFloat(clef_width.value)
    generator.generate()

    requestAnimationFrame(update_params)
}
