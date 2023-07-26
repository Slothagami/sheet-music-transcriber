class MIDIReader {
    constructor(notes) {
        this.notes = notes
        this.precision = 20
    }

    time_to_precision(time) {
        return Math.round(time*this.precision)/this.precision
    }

    get_quarter_note() {
        let durations = {}
        this.notes.forEach(note => {
            let duration = this.time_to_precision(note.duration)
            durations[duration] ??= 0
            durations[duration]++
        })

        let max = 0
        let max_time = 0
        for(let key in durations) {
            if(durations[key] > max) {
                max = durations[key]
                max_time = key
            } 
        }
        return max_time
    }

    group_chords() {
        // group notes that start at the same time.
        let chords = {}
        this.notes.forEach(note => {
            let time = this.time_to_precision(note.start_time)
            chords[time] ??= []
            chords[time].push({
                note: note.note,
                duration: note.duration
            })
        })
        return chords
    }
}
