const { Renderer, Stave, Voice, StaveNote, Formatter } = Vex.Flow
const durations  = {
    "w": 1,   "h": 1/2, 
    "q": 1/4, "8": 1/8
}

class ScoreGenerator {
    static settings = {
        margin:         .1,
        bar_margin:    .04,
        stave_height:   .1,
        font_size:     750,
        row_bars:        2,
        beats_per_bar:   4
    }
    constructor(score) {
        this.score = score
        this.generate()
        window.addEventListener("resize", () => {this.generate()})
    }

    generate() {
        div = document.getElementById("music")
        div.innerHTML = ""
        setup_renderer()
        page = {
            stave_x: margin, 
            stave_y: margin, 
            bars_in_row: 0
        }
        add_notes(this.score)
    }
}


var div, renderer, context, bar_width, inner_width, 
    width, height, margin, bar_margin, stave_height,
    page, font_size

function setup_renderer() {
    // size constants
    // width and height fill remaing space defined by .settings width in the css
    let settings_width = document.styleSheets[0].cssRules.item(0).style.width // item 0 of the css rules
    let page_width     = (100 - parseInt(settings_width)) / 100 // remaing space as percentage

    width  = page_width * window.innerWidth
    height = width * Math.SQRT2

    scale        = width / ScoreGenerator.settings.font_size
    margin       = (width * ScoreGenerator.settings.margin) / scale
    inner_width  = width - 2 * (margin * scale) // undo scale stretch before its applied again in bar_width
    bar_width    = (inner_width / ScoreGenerator.settings.row_bars) / scale
    bar_margin   = ((bar_width * scale) * ScoreGenerator.settings.bar_margin) / scale
    stave_height = (height * ScoreGenerator.settings.stave_height) / scale


    // initialize objects
    renderer = new Renderer(div, Renderer.Backends.SVG)
    renderer.resize(width, height)
    context  = renderer.getContext()

    // keep the music size relative to the page constant
    context.scale(scale, scale) 
}

function add_notes(notes) {
    let voice_args = {num_beats: ScoreGenerator.settings.beats_per_bar, beat_value: 4}
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
            formatter.joinVoices([voice]).format([voice], bar_width - bar_margin)
            voice.draw(context, stave)

            // reset
            stave = new_stave()
            voice = new Voice(voice_args)
            voice_notes = []
            beats = 0
        }
    })
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
    
    if(page.bars_in_row >= ScoreGenerator.settings.row_bars) {
        // breaks to new row after certain number of bars
        page.stave_y += stave_height
        page.stave_x = margin
        page.bars_in_row = 0
    }

    return stave
}
