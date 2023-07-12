const { Renderer, Stave, Voice, StaveNote, Formatter } = Vex.Flow
const durations  = {
    "w": 1,   "h": 1/2, 
    "q": 1/4, "8": 1/8
}

class ScoreGenerator {
    constructor(score) {
        this.score = score
        this.settings = {
            margin:         .1,
            bar_margin:    .00,
            stave_height:   .1,
            font_size:     750,
            row_bars:        2,
            beats_per_bar:   4,

            clef_width: .25,
        }
        this.generate()
        window.addEventListener("resize", () => {this.generate()})
    }

    generate() {
        this.div = document.getElementById("music")
        this.div.innerHTML = ""
        this.setup_renderer()
        this.page = {
            stave_x: this.margin, 
            stave_y: this.margin, 
            bars_in_row: 0
        }
        this.add_notes(this.score)
    }

    setup_renderer() {
        // size constants
        // width and height fill remaing space defined by .settings width in the css
        let settings_width = document.styleSheets[0].cssRules.item(0).style.width // item 0 of the css rules
        let page_width     = (100 - parseInt(settings_width)) / 100 // remaing space as percentage
    
        this.width  = page_width * window.innerWidth
        this.height = this.width * Math.SQRT2
    
        this.scale        = this.width / this.settings.font_size
        this.margin       = (this.width * this.settings.margin) / this.scale
        this.inner_width  = this.width - 2 * (this.margin * this.scale) // undo scale stretch before its applied again in bar_width
        this.bar_width    = (this.inner_width / this.settings.row_bars) / this.scale
        this.bar_margin   = ((this.bar_width * this.scale) * this.settings.bar_margin) / this.scale
        this.stave_height = (this.height * this.settings.stave_height) / this.scale
    
    
        // initialize objects
        this.renderer = new Renderer(this.div, Renderer.Backends.SVG)
        this.renderer.resize(this.width, this.height)
        this.context  = this.renderer.getContext()
    
        // keep the music size relative to the page constant
        this.context.scale(this.scale, this.scale) 
    }

    add_notes(notes) {
        let voice_args = {num_beats: this.settings.beats_per_bar, beat_value: 4}
        let stave = this.new_stave()
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
                stave.setContext(this.context).draw()
    
                // render voice
                voice.addTickables(voice_notes)
                formatter.joinVoices([voice]).format([voice], this.bar_width - this.bar_margin - this.stave_offset)
                voice.draw(this.context, stave)
    
                // reset
                stave = this.new_stave()
                voice = new Voice(voice_args)
                voice_notes = []
                beats = 0
            }
        })
    }

    new_stave() {
        // make a new stave in the correct position
        let stave = new Stave(this.page.stave_x, this.page.stave_y, this.bar_width)
        
        this.stave_offset = 0
        if(this.page.bars_in_row == 0) {
            // add clefs for first bar in a row
            stave.addClef("treble").addTimeSignature("4/4")
            this.stave_offset = this.settings.clef_width * this.bar_width
        }
    
        this.page.stave_x += this.bar_width
        this.page.bars_in_row++
        
        if(this.page.bars_in_row >= this.settings.row_bars) {
            // breaks to new row after certain number of bars
            this.page.stave_y += this.stave_height
            this.page.stave_x = this.margin
            this.page.bars_in_row = 0
        }
    
        return stave
    }
}
