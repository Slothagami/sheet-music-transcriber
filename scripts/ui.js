window.addEventListener("load", start)

var notes, title, subtitle, bpm, data
function start() {
    // navigator.clipboard.readText().then(data => {
    //     data = JSON.parse(data)
    //     notes = data.midi
    //     title = data.title
    //     subtitle = data.subtitle

    //     init()
    // })
    data = prompt("Paste MIDI Data")
    data = JSON.parse(data)
    notes = data.midi
    title = data.title
    subtitle = data.subtitle

    init()
}

function suggest_bpm() {
    // let counts = {}
    // notes.forEach(note => {
    //     let bpm = Math.round(4/note.duration)

    //     if(bpm >= 30) {
    //         counts[bpm] ??= 0
    //         counts[bpm]++
    //     }
    // })
    // return counts

    let last_time = notes[0].start_time
    let gap_total = 0
    for(let i = 1; i < notes.length; i++) {
        let gap = notes[i].start_time - last_time
        gap_total += gap
        last_time = notes[i].start_time
    }
    let avg_gap = gap_total / notes.length
    return 60 / (avg_gap * 4)
}

//#region verify sound

const ALL_NOTES_SHARP = [
                                                          "", 'A0', 'A#0', 'B0',
    'C1', 'C#1', 'D1', 'D#1', 'E1', 'F1', 'F#1', 'G1', 'G#1', 'A1', 'A#1', 'B1',
    'C2', 'C#2', 'D2', 'D#2', 'E2', 'F2', 'F#2', 'G2', 'G#2', 'A2', 'A#2', 'B2',
    'C3', 'C#3', 'D3', 'D#3', 'E3', 'F3', 'F#3', 'G3', 'G#3', 'A3', 'A#3', 'B3',
    'C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4',
    'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5',
    'C6', 'C#6', 'D6', 'D#6', 'E6', 'F6', 'F#6', 'G6', 'G#6', 'A6', 'A#6', 'B6',
    'C7', 'C#7', 'D7', 'D#7', 'E7', 'F7', 'F#7', 'G7', 'G#7', 'A7', 'A#7', 'B7',
    'C8'
]
const ALL_NOTES_FLAT = [
                                                          "", 'A0', 'Bb0', 'B0',
    'C1', 'Db1', 'D1', 'Eb1', 'E1', 'F1', 'Gb1', 'G1', 'Ab1', 'A1', 'Bb1', 'B1',
    'C2', 'Db2', 'D2', 'Eb2', 'E2', 'F2', 'Gb2', 'G2', 'Ab2', 'A2', 'Bb2', 'B2',
    'C3', 'Db3', 'D3', 'Eb3', 'E3', 'F3', 'Gb3', 'G3', 'Ab3', 'A3', 'Bb3', 'B3',
    'C4', 'Db4', 'D4', 'Eb4', 'E4', 'F4', 'Gb4', 'G4', 'Ab4', 'A4', 'Bb4', 'B4',
    'C5', 'Db5', 'D5', 'Eb5', 'E5', 'F5', 'Gb5', 'G5', 'Ab5', 'A5', 'Bb5', 'B5',
    'C6', 'Db6', 'D6', 'Eb6', 'E6', 'F6', 'Gb6', 'G6', 'Ab6', 'A6', 'Bb6', 'B6',
    'C7', 'Db7', 'D7', 'Eb7', 'E7', 'F7', 'Gb7', 'G7', 'Ab7', 'A7', 'Bb7', 'B7',
    'C8'
]

var audioCtx
function note_freq(note) {
    let ind = ALL_NOTES_SHARP.indexOf(note)
    if(ind == -1) {
        ind = ALL_NOTES_FLAT.indexOf(note)
    }

    let freq = 2 ** ((ind - 49) / 12) * 440
    return freq
}
function verify_sound() {
    audioCtx = new(window.AudioContext || window.webkitAudioContext)()

    notes.forEach(note => {
        setTimeout(() => {play_note(note.note, note.duration*1000)}, note.start_time * 1000)
    })
}
function play_note(note, duration) {
    let freq = note_freq(note)
    
    // create Oscillator node
    var oscillator = audioCtx.createOscillator()

    oscillator.type = 'square'
    oscillator.frequency.value = freq
    oscillator.connect(audioCtx.destination)
    oscillator.start();

    setTimeout(() => {
        oscillator.stop()
    }, duration)
}
//#endregion

var margin, size, score, parser, elem = {}
var params = new URLSearchParams(location.search)
function init() {
    // parser = new MIDIReader(notes, 168)
    bpm = suggest_bpm()
    parser = new MIDIReader(notes, bpm)
    score  = new ScoreGenerator(parser.score)

    // load params
    score.settings.title    = title    || params.get("title")    || ""
    score.settings.artist   = subtitle || params.get("subtitle") || ""
    
    // set the menus to reflect the score's default settings 
    for(let param in score.settings) {
        let el = document.getElementById(param)
        if (el) {
            elem[param] = el
            elem[param].value = score.settings[param]
        }
    }
    
    // fill out key dropdown options lists
    fill_dropdown("key",            score.key_signatues)
    fill_dropdown("time_signature", score.time_signatures)

    // attach button functions
    set_button("#pdf-button", score.download_pdf)
    set_button("#svg-button", score.download_svg)
    set_button("#play-button", verify_sound)

    requestAnimationFrame(update_params)

    // update the display after a change
    document.querySelectorAll("select, input").forEach(el => {
        el.addEventListener("change", update_params)
    })
}

function update_params() {
    // update the score to reflect the UI settings
    for(let param in elem) {
        score.settings[param] = elem[param].value
    }
    
    score.generate()
    // requestAnimationFrame(update_params)
}


function fill_dropdown(dropdown, options) {
    // add the dropdown options from the list
    options.forEach(key => {
        let op = document.createElement("option")
            op.value = key
            op.innerText = key

        elem[dropdown].appendChild(op)
    })
    
    // update its value again
    elem[dropdown].value = score.settings[dropdown]
}

function set_button(selector, func) {
    let btn = document.querySelector(selector)
    btn.addEventListener("click", func)
}
