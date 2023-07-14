const { Renderer, Stave, Voice, StaveNote, Formatter, Clef, TimeSignature, TextNote } = Vex.Flow
const durations  = {
    "w": 1,   "h": 1/2, 
    "q": 1/4, "8": 1/8
}

class ScoreGenerator {
    constructor(score) {
        this.score = score
        this.settings = {
            title:       score.title,
            subtitle: score.subtitle,
            artist:     score.artist,
            key:           score.key,
            margin:               .1,
            stave_height:        .15,
            font_size:           925,
            row_bars:              3,
            beats_per_bar:         4,
            title_space:        .055,
            min_title_space:    .001,
            title_size:         .035,
            stave_gap:           .07,
            tie_scale:            .8,
        }
        this.generate()
        window.addEventListener("resize", () => {this.generate()})
    }

    generate() {
        // scroll position is reset when deleting the existing sheet music from the page
        let scrollX = window.pageXOffset || document.documentElement.scrollLeft
        let scrollY = window.pageYOffset || document.documentElement.scrollTop

        this.div = document.getElementById("music")
        this.div.innerHTML = ""

        this.setup_renderer()

        let title_visible = this.settings.title_space >= this.settings.min_title_space
        let title_margin = title_visible? this.margin * .75: 0
        this.page = {
            stave_x: this.margin, 
            stave_y: this.margin + this.title_space + title_margin, 
            bars_in_row: 0
        }
        this.add_notes()
        this.add_text()

        // return to previous scroll position
        window.scrollTo(scrollX, scrollY)
    }

    add_text() {
        let svg = document.querySelector("svg")
        if(this.settings.title_space >= this.settings.min_title_space) {
            // add style
            let style = document.createElement("style")
                style.innerText = "text {font-family: serif}"

            svg.appendChild(style)

            // Add title 
            let center_y = this.margin + this.title_space/2
            this.text_element(this.settings.title,    svg, "50%", center_y, this.title_size)
            this.text_element(this.settings.subtitle, svg, "50%", center_y + this.title_size, this.title_size/2)
            
            // corner text
            let lines = this.settings.artist.split("\n")
            let line_height = this.title_size/2 + 3
            let voffset = line_height * lines.length
            for(let i = 0; i < lines.length; i++) {
                this.text_element(
                    lines[i], svg, 
                    (1 - this.settings.margin) * 100 + "%", 
                    this.margin*1.7 + this.title_space + this.title_size - voffset + line_height*i, 
                    this.title_size/2, 
                    true
                )
            }
        }
    }
    text_element(text, svg, x, y, size, iscorner=false) {
        var svg_ns = "http://www.w3.org/2000/svg";
        var new_text = document.createElementNS(svg_ns, "text")

        new_text.setAttributeNS(null, "x", x)  
        new_text.setAttributeNS(null, "y", y)
        new_text.setAttributeNS(null, "font-size", size)
        
        if(iscorner) {
            new_text.setAttributeNS(null, "text-anchor", "end")
        } else {
            new_text.setAttributeNS(null, "text-anchor", "middle")
        }

        var text_node = document.createTextNode(text)
        new_text.appendChild(text_node)
        svg.appendChild(new_text)
    }

    setup_renderer() {
        // size constants
        let settings_width = document.querySelector(".settings").offsetWidth

        this.width  = window.innerWidth - settings_width
        this.height = this.width * Math.SQRT2
    
        this.scale        = this.width / this.settings.font_size
        this.margin       = (this.width * this.settings.margin) / this.scale
        this.inner_width  = this.width - 2 * (this.margin * this.scale) // undo scale stretch before its applied again in bar_width
        this.bar_width    = (this.inner_width / this.settings.row_bars) / this.scale
        this.stave_height = (this.height * this.settings.stave_height) / this.scale
        this.stave_gap    = (this.height * this.settings.stave_gap) / this.scale
        this.title_space  = (this.settings.title_space * this.height) / this.scale
        this.title_size   = (this.settings.title_size * this.height) / this.scale
    
        // initialize objects
        this.renderer = new Renderer(this.div, Renderer.Backends.SVG)
        this.renderer.resize(this.width, this.height)
        this.context  = this.renderer.getContext()
    
        // keep the music size relative to the page constant
        this.context.scale(this.scale, this.scale) 
    }

    add_notes() {
        let score = this.score
        let voice_args = {num_beats: this.settings.beats_per_bar, beat_value: 4}
        let bar = this.new_bar()
        let treble_voice = new Voice(voice_args)
        let bass_voice   = new Voice(voice_args)
        let treble_notes, bass_notes

        let treble_ind = 0
        let bass_ind   = 0
        while(true) {
            if(treble_ind >= score.treble.length) break
            
            // get this bar's set of notes
            let treble   = this.next_bar_notes(score.treble, treble_ind)
            treble_ind   = treble.index
            treble_notes = this.decorate_bar(treble.notes)

            let bass   = this.next_bar_notes(score.bass, bass_ind)
            bass_ind   = bass.index
            bass_notes = this.decorate_bar(bass.notes)

            // render voice
            this.draw_bar(bar)
            this.draw_voice(treble_voice, treble_notes, bar.treble)
            this.draw_voice(bass_voice,   bass_notes,   bar.bass  )

            // reset for next bar
            bar          = this.new_bar()
            treble_voice = new Voice(voice_args)
            bass_voice   = new Voice(voice_args)
        }
    }

    next_bar_notes(voice, index) {
        let note, beats = 0, notes = []

        // loop until the beats in a bar is filled
        while(beats < 1) {
            note = voice[index]
            beats += durations[note.duration.replace("r", "")]
            notes.push(note)
            index++
        }
        return { index, notes }
    }

    decorate_bar(notes) {
        // adds ties, beams and other symbols
        // converts MIDI notes into VexFlow notation format
        let elements = [] // elements that need seperate rendering

        let vex_notes = []
        notes.forEach(note => {
            let vex_note = new StaveNote(note)
            vex_notes.push(vex_note)
        })

        // add contextual ties (split 1/4 note into 2 tied 8th notes if sourrdounded by 8th notes)
        let context_ties = []
        for(let i = 0; i < vex_notes.length; i++) {
            let note = vex_notes[i]

            let not_on_edge = i > 0 && i < vex_notes.length - 1
            let is_quarter_note = note.duration == "q"
            
            let eigth_left  = false
            let eigth_right = false

            if(not_on_edge) {
                // calculate only if indexes will be valid
                eigth_left  = vex_notes[i-1].duration == "8"
                eigth_right = vex_notes[i+1].duration == "8"
            }
            let is_samwiched = eigth_left && eigth_right

            if(not_on_edge && is_quarter_note && is_samwiched) {
                // replace with two tied 8th notes
                let start = new StaveNote({
                    keys: note.keys,
                    duration: "8"
                })
                let end = new StaveNote({
                    keys: note.keys,
                    duration: "8"
                })

                context_ties.push(start, end)
                let tie_scale = this.settings.tie_scale

                elements.push(new Vex.Flow.StaveTie({
                    first_note: start,
                    last_note: end,
                    first_indices: [0],
                    last_indices:  [0],
                }).setDirection(tie_scale))

                elements.push(new Vex.Flow.StaveTie({
                    first_note: start,
                    last_note: end,
                    first_indices: [note.keys.length-1],
                    last_indices:  [note.keys.length-1],
                }).setDirection(-tie_scale))
            } else {
                // leave note as is
                context_ties.push(note)
            }

        }
        vex_notes = context_ties

        return {notes: vex_notes, elements}
    }

    new_bar() {
        // make a new stave in the correct position
        let stave      = new Stave(this.page.stave_x, this.page.stave_y, this.bar_width)
        let bass_stave = new Stave(this.page.stave_x, this.page.stave_y + this.stave_gap, this.bar_width)
        
        // connect the staves
        let line_right = new Vex.Flow.StaveConnector(stave, bass_stave).setType(0)
        let line_left  = new Vex.Flow.StaveConnector(stave, bass_stave).setType(1)
        let brace      = null

        if(this.page.bars_in_row == 0) {
            // add decorations to start the row
            stave.addClef("treble")
                .addTimeSignature("4/4")
                .addKeySignature(this.settings.key)
                
            bass_stave.addClef("bass")
                .addTimeSignature("4/4")
                .addKeySignature(this.settings.key)

            brace = new Vex.Flow.StaveConnector(stave, bass_stave).setType(3)
        }
    
        this.page.stave_x += this.bar_width
        this.page.bars_in_row++
        
        if(this.page.bars_in_row >= this.settings.row_bars) {
            // breaks to new row after certain number of bars
            this.page.stave_y += this.stave_height
            this.page.stave_x = this.margin
            this.page.bars_in_row = 0
        }

        return {
            treble: stave, 
            bass: bass_stave, 
            line_left, line_right,
            brace
        }
    }

    draw_bar(bar) {
        for(let elt in bar) {
            if(bar[elt]) {
                bar[elt].setContext(this.context).draw()
            }
        }
    }

    draw_voice(voice, notes, stave) {
        voice.addTickables(notes.notes)
        Vex.Flow.Formatter.FormatAndDraw(
            this.context, stave, notes.notes,
            {align_rests: true, auto_beam: true}
        )

        notes.elements.forEach(elt => {
            elt.setContext(this.context).draw()
        })
    }
}
