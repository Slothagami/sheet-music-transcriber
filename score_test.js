var vf, score, system, midiData
var x = 0, y = 10

const staveWidth = 750
const svgWidth   = 800
const svgHeight  = 500
const durations  = {
    "w": 1,   "h": 1/2, 
    "q": 1/4, "8": 1/8
}

window.addEventListener("load", init)

function init() {
    midiData = [
        // Megalovania
        { keys: ["E/4"], duration: "q" },
        { keys: ["D/4"], duration: "q" },
        { keys: ["C/4"], duration: "q" },
        { keys: ["D/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["D/4"], duration: "q" },
        { keys: ["D/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["G/4"], duration: "h" },
        { keys: [], duration: "q", isOctaveShift: true, octaveShift: -1 },
        { keys: ["G/4"], duration: "h" },
        { keys: [], duration: "q", isOctaveShift: true, octaveShift: -1 },
        { keys: ["G/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["A/4"], duration: "q" },
        { keys: ["A/4"], duration: "q" },
        { keys: [], duration: "q", isOctaveShift: true, octaveShift: -1 },
        { keys: ["A/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["G/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["D/4"], duration: "q" },
        { keys: ["C/4"], duration: "q" },
        { keys: ["D/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: [], duration: "q", isOctaveShift: true, octaveShift: -1 },
        { keys: ["E/4"], duration: "q" },
        { keys: ["E/4"], duration: "q" },
        { keys: ["F/4"], duration: "q" },
        { keys: ["G/4"], duration: "h" }
    ]
    
    // setup renderer and stave
    var renderer = new Vex.Flow.Renderer(
        document.getElementById("music"),
        Vex.Flow.Renderer.Backends.SVG
    ).resize(svgWidth, svgHeight)

    var context = renderer.getContext()
    var stave   = new Vex.Flow.Stave(10, 0, staveWidth)
        stave.addClef("treble")
        stave.setContext(context).draw()

    // Convert MIDI data to VexFlow notes
    var notes         = []
    var octaveOffset  = 0
    var bar_beats     = 0
    var bar_count     = 0

    for (let note of midiData) {
        note.auto_stem = true

        if (note.keys.length > 0) {
            var vexNote = new Vex.Flow.StaveNote(note)
            notes.push(vexNote)
            bar_beats += durations[note.duration]

            if(bar_beats >= 1) {
                // add barline
                notes.push(new Vex.Flow.BarNote())
                bar_beats = 0
                bar_count++
            }
        }

        if (note.isOctaveShift) {
            octaveOffset += note.octaveShift
        }
    }

    // create voice
    var voice = new Vex.Flow.Voice({ num_beats: midiData.length-1, beat_value: 4 })
    voice.addTickables(notes)

    // format notes
    var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400)
    voice.draw(context, stave)
}
