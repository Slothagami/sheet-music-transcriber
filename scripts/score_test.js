// https://github.com/0xfe/vexflow/wiki/Tutorial
window.addEventListener("load", init)

const { Renderer, Stave, Voice, StaveNote, Formatter } = Vex.Flow
const margin   = 50
const row_bars = 2
const stave_height = 130
const beats_per_bar = 4
const durations  = {
    "w": 1,   "h": 1/2, 
    "q": 1/4, "8": 1/8
}
const test_song  = [
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

var div, renderer, context, bar_width, inner_width, width, height
function init() {
    setup_renderer()
    add_notes(test_song)
}

function setup_renderer() {
    // size constants

    // width and height fill remaing space defined by .settings width in the css
    let settings_width = document.styleSheets[0].cssRules.item(0).style.width // item 0 of the css rules
    let page_width     = (100 - parseInt(settings_width)) / 100 // remaing space as percentage

    width  = page_width * window.innerWidth
    height = width * Math.SQRT2

    inner_width = width - 2 * margin
    bar_width   = inner_width / row_bars

    // initialize objects
    div      = document.getElementById("music")
    renderer = new Renderer(div, Renderer.Backends.SVG)
    renderer.resize(width, height)
    context  = renderer.getContext()
}

function add_notes(notes) {
    let voice_args = {num_beats: beats_per_bar, beat_value: 4}
    let stave = new_stave()
    let voice = new Voice(voice_args)
    let voice_notes = []
    let formatter = new Formatter()

    let beats  = 0
    notes.forEach(note => {
        beats += durations[note.duration.replace("r", "")]
        voice_notes.push(
            new StaveNote(note)
        )
        if(beats >= 1) {
            // render stave
            stave.setContext(context).draw()

            // render voice
            voice.addTickables(voice_notes)
            formatter.joinVoices([voice]).format([voice], bar_width)
            voice.draw(context, stave)

            // reset
            stave = new_stave()
            voice = new Voice(voice_args)
            voice_notes = []
            beats = 0
        }
    })
}

var page = {
    stave_x: margin, 
    stave_y: margin, 
    bars_in_row: 0
}
function new_stave() {
    // make a new stave in the correct position
    let stave = new Stave(page.stave_x, page.stave_y, bar_width)
    
    if(page.bars_in_row == 0) {
        // add clefs for first bar in a row
        stave.addClef("treble").addTimeSignature("4/4")
    }

    page.stave_x += bar_width
    page.bars_in_row++
    
    if(page.bars_in_row >= row_bars) {
        // breaks to new row after certain number of bars
        page.stave_y += stave_height
        page.stave_x = margin
        page.bars_in_row = 0
    }

    return stave
}
