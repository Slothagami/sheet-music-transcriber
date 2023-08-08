const { Renderer, Stave, Voice, StaveNote, Formatter, Clef, TimeSignature, TextNote } = Vex.Flow

class ScoreGenerator {
    static durations = {
        // whole notes
        "w":  1,    // dotted notes
        "h":  1/2,  "hd":  1/2  * 1.5, 
        "q":  1/4,  "qd":  1/4  * 1.5, 
        "8":  1/8,  "8d":  1/8  * 1.5,
        "16": 1/16, "16d": 1/16 * 1.5
    }
    static key_signatues = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G', 
        'C#', 'F#',
        'Ab', 'Bb', 'Db', 'Eb', 'Gb'
    ]
    static time_signatures = [
        "none",
        "C",   '4/4',  '3/4', 
        '2/4', '2/2',  '3/8', 
        '3/2', '4/8',  '4/2', 
        '6/8', '6/4',  '9/8', 
        '9/4', '12/8', '12/4'
    ]
    static notes = `
        A0 B0
        C1 D1 E1 F1 G1 A1 B1
        C2 D2 E2 F2 G2 A2 B2 
        C3 D3 E3 F3 G3 A3 B3 
        C4 D4 E4 F4 G4 A4 B4 
        C5 D5 E5 F5 G5 A5 B5
        C6 D6 E6 F6 G6 A6 B6 
        C7 D7 E7 F7 G7 A7 B7 
        C8
    `   .trim()
        .replaceAll("\n", " ")
        .replaceAll("\t", "")
        .replaceAll(/\s+/g, " ")
        .split(" ")

    constructor(score) {
        this.container = document.querySelector("#pages")
        this.page_number = 1
        this.svg = null

        this.durations       = ScoreGenerator.durations
        this.key_signatues   = ScoreGenerator.key_signatues
        this.time_signatures = ScoreGenerator.time_signatures
        this.notes           = ScoreGenerator.notes

        this.score = score

        // everything listed in settings exposed to the GUI to be changed
        this.settings = {
            title:       score.title || "",
            subtitle: score.subtitle || "",
            artist:     score.artist || "",
            key:           score.key || "C",
            time_signature: score.time_signature || "none",
            margin:              .10,
            stave_height:        .17,
            font_size:          1090,
            row_bars:              3,
            beats_per_bar:         4,
            title_space:        .055,
            min_title_space:    .001,
            title_size:         .035,
            stave_gap:           .07,
            tie_scale:            .8,
            first_bar_grow:       .1,
        }
        this.generate()
        window.addEventListener("resize", () => {this.generate()})
    }
    
    new_page(title=false) {
        // create new page in HTML
        this.div = document.createElement("div")
        this.div.className = "sheet-music-page"
        this.container.appendChild(this.div)

        // create new renderer for the page
        this.renderer = new Renderer(this.div, Renderer.Backends.SVG)
        this.renderer.resize(this.width, this.height)
        this.context  = this.renderer.getContext()
    
        // keep the music size relative to the page constant
        this.context.scale(this.scale, this.scale) 

        // setup page object
        let title_margin = 0
        let title_visible = this.settings.title_space >= this.settings.min_title_space
        
        if(title) {
            title_margin = title_visible? this.margin * .75: 0
            title_margin += this.title_space
        }

        this.page = {
            stave_x: this.margin, 
            stave_y: this.margin + title_margin, 
            bars_in_row: 0
        }

        // add page number 
        this.svg = this.div.querySelector("svg")
        this.text_element(
            this.page_number, this.svg, 
            "50%", 
            this.height / this.scale - this.margin/2, 
            this.title_size/2
        )
        this.page_number++

        // change the font for the svg
        let style = document.createElement("style")
            style.innerText = "text {font-family: serif}"
        this.svg.appendChild(style)
    }

    download_pdf(a) {
        alert("not currently implimented")
    }

    download_svg(a) {
        alert("not currently implimented")
        // let svg_dat = generator.renderer.ctx.save()
    }

    generate() {
        // save scroll position (its reset upon deleting the old sheet music)
        let scrollX = window.pageXOffset || document.documentElement.scrollLeft
        let scrollY = window.pageYOffset || document.documentElement.scrollTop

        this.page_number = 1
        this.container.innerHTML = ""

        this.setup_renderer()
        this.new_page(true)
        this.add_text()
        this.add_notes()

        // return to previous scroll position
        window.scrollTo(scrollX, scrollY)
    }

    add_text() {
        if(this.settings.title_space >= this.settings.min_title_space) {
            // add title & subtitle
            let center_y = this.margin + this.title_space/2
            this.text_element(this.settings.title,    this.svg, "50%", center_y,  this.title_size)
            this.text_element(this.settings.subtitle, this.svg, "50%", center_y + this.title_size, this.title_size/2)
            
            // add author text in corner of title space
            let lines       = this.settings.artist.split("\n")
            let line_height = this.title_size/2 + 3
            let voffset     = line_height * lines.length

            // add each line individually
            for(let i = 0; i < lines.length; i++) {
                this.text_element(
                    lines[i], this.svg, 
                    (1 - this.settings.margin) * 100 + "%", 
                    this.margin*1.5 + this.title_space + this.title_size - voffset + line_height*i, 
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
        
        // set text align
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
        // calculate sizes
        let settings_width = document.querySelector(".settings").offsetWidth
        
        // page
        this.width  = window.innerWidth - settings_width
        this.height = this.width * Math.SQRT2
        this.scale  = this.width / this.settings.font_size

        // margins
        this.margin       = (this.width / this.scale) * parseFloat(this.settings.margin)
        this.inner_width  = this.width - 2 * (this.margin * this.scale) // undo scale stretch before its applied again in bar_width
        
        // bars
        this.uniform_bar_width = (this.inner_width / this.settings.row_bars) / this.scale
        this.first_bar_width   = this.uniform_bar_width * (1 + parseFloat(this.settings.first_bar_grow))

        let remaining_width  = this.inner_width - this.first_bar_width * this.scale
        this.small_bar_width = (remaining_width / (this.settings.row_bars-1)) / this.scale
        
        // staves & titles
        this.stave_height = (this.height * this.settings.stave_height) / this.scale
        this.stave_gap    = (this.height * this.settings.stave_gap) / this.scale
        this.title_space  = (this.settings.title_space * this.height) / this.scale
        this.title_size   = (this.settings.title_size * this.height) / this.scale
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

        // loop through and draw each bar
        while(true) {
            if(treble_ind >= score.treble.length) break
            
            // get the notes in the next bar
            let treble   = this.next_bar_notes(score.treble, treble_ind)
            treble_ind   = treble.index
            treble_notes = this.decorate_bar(treble)

            let bass   = this.next_bar_notes(score.bass, bass_ind)
            bass_ind   = bass.index
            bass_notes = this.decorate_bar(bass, true)

            // render voice
            this.draw_bar(bar)
            this.draw_voice(treble_voice, treble_notes, bar.treble)
            this.draw_voice(bass_voice,   bass_notes,   bar.bass  )

            // reset for next bar
            let last_bar = score.treble.length == treble_ind
            bar          = this.new_bar(last_bar)
            treble_voice = new Voice(voice_args)
            bass_voice   = new Voice(voice_args)
        }
    }

    next_bar_notes(voice, index) {
        let note, beats = 0, notes = [], elements = []

        // loop until the beats in a bar is filled
        while(beats < 1) {
            if(index == voice.length) break
            note = voice[index]
            switch (this.note_type(note)) {
                case "note":
                case "tuplet":
                    beats += this.note_duration(note)
                    break

                case "tie_group":
                    note.notes.forEach(note_head => {
                        // add duration for each note of group, assumes group is within valid length for the bar
                        beats += this.note_duration(note_head)
                    })
                    break

            }
            notes.push(note)
            index++
        }
        return { index, notes, elements }
    }

    note_type(note) {
        if(note.hasOwnProperty("type")) return note.type
        return "note"
    }


    new_note(note, is_bass) {
        if(is_bass) note.clef = "bass"
        if(note.duration.endsWith("r")) {
            // center rests (if this note is a rest)
            note.keys = ["b/4"]
            if(is_bass) note.keys = ["c/3"]
        }

        let vex_note = new StaveNote(note)
        if(note.duration.endsWith("d")) {
            // add dot symbol if the note is dotted
            Vex.Flow.Dot.buildAndAttach([vex_note], {all: true})
        }
        return vex_note
    }

    flatten_groups(note, is_bass) {
        // gives a list of individual notes, and decorates them with symbols
        let notes = []
        let elements = []

        switch (this.note_type(note)) {
            case "note": notes.push(this.new_note(note, is_bass)); break
            case "tie_group":
                let prev_note = null
                note.notes.forEach(note_head => {
                    // add the note
                    let note_obj = this.new_note(note_head, is_bass)
                    notes.push(note_obj)
                    
                    // tie it to the previous note
                    if (prev_note != null) {
                        this.tie_notes(prev_note, note_obj).forEach(tie => elements.push(tie))
                    }
                    prev_note = note_obj
                })
                break

            case "tuplet":
                let tuplet_notes = []
                note.notes.forEach(note_head => {
                    // add the note to the list
                    let note_obj = this.new_note(note_head, is_bass)
                    tuplet_notes.push(note_obj)
                    notes.push(note_obj)
                })

                // make tuplet sumbol
                let tuplet = new Vex.Flow.Tuplet(
                    tuplet_notes, {
                        notes_occupied: 1/4,
                        bracketed: true
                    }   
                )
                elements.push(tuplet)
                break
        }
        return { notes, elements }
    }

    note_duration(note) {
        return this.durations[note.duration.replace("r", "")]
    }

    decorate_bar(bar, is_bass=false) {
        // adds dynamic ties, beams and other symbols
        // converts MIDI notes into VexFlow notation format

        let elements = [...bar.elements] // elements that need seperate rendering
        let vex_notes = []
        bar.notes.forEach(note => {
            let group = this.flatten_groups(note, is_bass)

            group.notes   .forEach(note => vex_notes.push(note))
            group.elements.forEach(el   => elements .push(el))
        })

        // add contextual ties (split 1/4 note into 2 tied 8th notes if sourrdounded by 8th notes)
        let context_tie_notes = []
        for(let i = 0; i < vex_notes.length; i++) {
            let note = vex_notes[i]

            // work out if a tie is needed
            let not_on_edge = i > 0 && i < vex_notes.length - 1
            let is_quarter_note = note.duration == "q" && !note.noteType == "r"
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
                let start = this.new_note({
                    keys: note.keys,
                    duration: "8"
                }, is_bass)

                let end = this.new_note({
                    keys: note.keys,
                    duration: "8"
                }, is_bass)

                context_tie_notes.push(start, end)

                this.tie_notes(start, end)
                    .forEach(tie => elements.push(tie))

            } else {
                // leave note as is
                context_tie_notes.push(note)
            }

        }
        vex_notes = context_tie_notes

        return {notes: vex_notes, elements}
    }

    tie_notes(note_a, note_b) {
        let top_tie = new Vex.Flow.StaveTie({
            first_note: note_a,
            last_note: note_b,
            first_indices: [note_a.keys.length-1],
            last_indices:  [note_a.keys.length-1],
        }).setDirection(-this.settings.tie_scale)

        let bottom_tie = new Vex.Flow.StaveTie({
            first_note: note_a,
            last_note: note_b,
            first_indices: [0],
            last_indices:  [0],
        }).setDirection(this.settings.tie_scale)

        return [top_tie, bottom_tie]
    }

    new_bar(last_bar=false) {
        // if the next bar will go over the page, make a new one
        let bar_bbox_bottom = this.page.stave_y + this.stave_height
        let page_bottom     = this.height / this.scale - this.margin

        if(bar_bbox_bottom >= page_bottom) {
            if(!last_bar) this.new_page()
        }

        // make new staves
        let width = this.page.bars_in_row == 0? this.first_bar_width: this.small_bar_width
        let stave      = new Stave(this.page.stave_x, this.page.stave_y, width)
        let bass_stave = new Stave(this.page.stave_x, this.page.stave_y + this.stave_gap, width)
        
        // connect the staves
        let line_right = new Vex.Flow.StaveConnector(stave, bass_stave).setType(0)
        let line_left  = new Vex.Flow.StaveConnector(stave, bass_stave).setType(1)
        let brace      = null

        if(this.page.bars_in_row == 0) {
            // add decorations to start of row
            stave.addClef("treble")
                .addKeySignature(this.settings.key)

            bass_stave.addClef("bass")
                .addKeySignature(this.settings.key)

            if(this.settings.time_signature != "none") {
                stave.addTimeSignature(this.settings.time_signature)
                bass_stave.addTimeSignature(this.settings.time_signature)
            }

            brace = new Vex.Flow.StaveConnector(stave, bass_stave).setType(3)
        }
    
        this.page.stave_x += width
        this.page.bars_in_row++
        
        // break to new row if needed
        if(this.page.bars_in_row >= this.settings.row_bars) {
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
        // // for drawing debug shapes:
        // let rnd = this.renderer.getContext()
        // rnd.fillRect(25, this.height / this.scale - this.margin, 200, 5) // limit
        // rnd.fillRect(50, this.page.stave_y + this.stave_height, 20, 20)

        for(let component in bar) {
            if(bar[component]) {
                bar[component].setContext(this.context).draw()
            }
        }
    }

    draw_voice(voice, notes, stave) {
        // use non strict mode to allow incorrect beats ber bar for rendering tuplets
        voice.setStrict(false)
        voice.addTickables(notes.notes)

        Vex.Flow.Formatter.FormatAndDraw(
            this.context, stave, notes.notes,
            {align_rests: false, auto_beam: true}
        )

        notes.elements.forEach(elt => {
            elt.setContext(this.context).draw()
        })
    }
}
