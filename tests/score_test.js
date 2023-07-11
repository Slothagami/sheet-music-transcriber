var vf, score, system, x = 0, y = 10, midiData
function init() {
    // MIDI data for "Megalovania"
    midiData = [
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
    ];
    var durations = {
        "w": 1,   "h": 1/2, 
        "q": 1/4, "8": 1/8
    }

    // Create a Vex.Flow.Renderer instance
    var renderer = new Vex.Flow.Renderer(
        document.getElementById("music"),
        Vex.Flow.Renderer.Backends.SVG
    );

    // Define the size of the rendering area
    renderer.resize(500, 200);

    // Create a Vex.Flow.Context instance
    var context = renderer.getContext();
    var stave = new Vex.Flow.Stave(10, 0, 480);

    stave.addClef("treble");
    stave.setContext(context).draw();

    // Convert MIDI data to VexFlow notes
    var notes = [];
    var octaveOffset = 0;
    var bar_beats = 0
    var bar_count = 0
    var currentStaveY = 10
    var staveWidth = 400

    for (let note of midiData) {
        note.auto_stem = true

        if (note.keys.length > 0) {
            var vexNote = new Vex.Flow.StaveNote(note);
            notes.push(vexNote);
            bar_beats += durations[note.duration]

            if(bar_beats >= 1) {
                notes.push(new Vex.Flow.BarNote())
                bar_beats = 0
                bar_count++

                if (bar_count >= 5) { 
                    // bar_count = 0
                    // currentStaveY += 100
                    // var stave = new Vex.Flow.Stave(10, currentStaveY, staveWidth);
                    // stave.addClef("treble").setContext(context).draw();
                }
            }
        }

        if (note.isOctaveShift) {
            octaveOffset += note.octaveShift;
        }
    }

    // Create a voice with the converted notes
    var voice = new Vex.Flow.Voice({ num_beats: midiData.length-1, beat_value: 4 });
    voice.addTickables(notes);

    // Format and justify the notes to fit within the stave
    var formatter = new Vex.Flow.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);
}

window.addEventListener("load", init)
