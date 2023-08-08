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

        let last_pause = 0
        let treb = [], bas = []
        for(let i = 0; i < max_beat; i++) {
            treble[i] ??= []
            bass[i]   ??= []

            // combine notes of the same length on the same beat
            if(treble[i].length > 0) {
                let keys_treb = []
                treble[i].forEach(key => {keys_treb.push(this.to_proper_note(key.note))})
                keys_treb = [...new Set(keys_treb)] // remove duplicates
                treb.push({keys: keys_treb, duration: treble[i][0].duration})

                // if there's a gap between notes, add a rest
                let beat_diff = i - last_pause
                if(beat_diff > 1) {
                    console.log("rest")
                }

                // record last full space
                last_pause = i
            }

            if(bass[i].length > 0) {
                let keys_bass = []
                bass[i].forEach(key => {keys_bass.push(this.to_proper_note(key.note))})
                keys_bass = [...new Set(keys_bass)]
                bas.push({keys: keys_bass, duration: bass[i][0].duration})
            }
        }
        treble = treb
        bass   = bas 
        console.log(treble, bass)

        return { treble, bass }
    }

    to_proper_note(note) {
        return note.replace(/([A-G])#|b?(\d)/, "$1/$2")
    }
}
