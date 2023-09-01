class MIDIReader {
    constructor(notes, bpm) {
        this.notes = notes
        this.bpm = bpm
        this.beat_length = 60/bpm
        this.score = this.group_chords()
    }

    beat(time) {
        // round time to nearest beat
        time = Math.round(time*this.bpm)/this.bpm
        return Math.round(time / this.beat_length)
    }

    length(time) {
        time = Math.round(time*16)/16
        let beat_length = time / this.beat_length

        let durations = ScoreGenerator.durations
        let min_error = 1000
        let best_div = "q"
        for(let division in durations) {
            let error = Math.abs(beat_length - durations[division])
            if (error < min_error) {
                min_error = error
                best_div = division
            }
        }
        return best_div
    }

    is_treble_note(note) {
        let notes = ScoreGenerator.notes
        note = note.replace("b","").replace("#","").replace("/","")
        return notes.indexOf(note) >= notes.indexOf("C4")
    }

    generate_clef(notes, max_beat) {
        let voice = []
        let last_pause = 0
        let last_note_length = 0
        for(let i = 0; i < max_beat; i++) {
            notes[i] ??= []

            // combine notes of the same length on the same beat
            if(notes[i].length > 0) {
                let keys = []
                notes[i].forEach(key => {keys.push(this.to_proper_note(key.note))})
                keys = [...new Set(keys)] // remove duplicates
                // keys = keys.sort((a, b) => {
                //     let notes = ScoreGenerator.notes
                //     a = a.replace("/","")
                //     b = b.replace("/","")
                //     return notes.indexOf(a) < notes.indexOf(b)
                // })
                let note_length = notes[i][0].duration
                voice.push({keys, duration: note_length})

                // if there's a gap between notes, add a rest
                let smallest_note = 16
                let beat_diff = i/smallest_note - last_pause
                if(beat_diff > last_note_length) { // needs to be greater than last note's duration
                    voice.push({keys: "C/5", duration: this.length(beat_diff) + "r"})
                }

                // record last full space
                last_pause = i/smallest_note
                last_note_length = ScoreGenerator.durations[note_length]
            }
        }
        return voice
    }

    group_chords() {
        // group notes that start at the same time.
        let treble = [], bass = []
        let max_beat = 0
        this.notes.forEach(note => {
            let beat = this.beat(note.start_time)
            if (max_beat < beat) max_beat = beat
            treble[beat] ??= []
            bass[beat] ??= []

            let new_note = {
                note: note.note,
                duration: this.length(note.duration)
            }

            if(this.is_treble_note(note.note)) {
                treble[beat].push(new_note)
            } else {
                bass[beat].push(new_note)
            }

        })

        treble = this.generate_clef(treble, max_beat)
        bass   = this.generate_clef(bass, max_beat)
        return { treble, bass }
    }

    to_proper_note(note) {
        return note.replace(/([A-G])#|b?(\d)/, "$1/$2")
    }
}
