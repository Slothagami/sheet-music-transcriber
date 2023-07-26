// add vexflow libary, for displaying the sheet music after its generated
//var script = document.createElement("script")
//script.src = "https://cdn.jsdelivr.net/npm/vexflow/build/cjs/vexflow.js"

class VideoParser {
	constructor () {
		this.video  = document.querySelector("video")
		this.canvas = document.createElement("canvas")
		this.c 	    = this.canvas.getContext("2d", {willReadFrequently: true})

		this.canvas.width  = this.video.videoWidth
		this.canvas.height = 25
		this.canvas.style.position = "fixed"
		this.canvas.style.bottom   = 0
		this.canvas.style.right    = 0
		
		document.body.appendChild(this.canvas)

		// constants
		this.keywidth     = this.video.videoWidth / notes.length
		this.min_keywidth = this.keywidth / 2
	}

}

//#region Constants
const notes = `
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
	.replaceAll("  ", " ")
	.split(" ")

const sharps = ["C", "D", "F", "G", "A"] // notes that have a sharp
const fps    = 24
//#endregion

var window_y = 0
let brightness_cutoff = .5
let note_strength_cutoff = .7
var resetting = false
var capturing_video = false
var video_speed = 2

// Note Utility Functions
function sharpen(note) {
	return note.charAt(0) + "#" + note.charAt(1)
}
function flatten(note) {
	return note.charAt(0) + "b" + note.charAt(1)
}
function note_index(note) {
	return notes.indexOf(note)
}

var data
function capture_data() {
	data = parser.c.getImageData(0, window_y, parser.video.videoWidth, 1).data
}

function window_pixel(pos) {
	// return a pixel brightness in the window
	// arranged as [RGBA, RGBA, ...] for each pixel in order
	pos *= 4

	let r = data[pos]
	let g = data[pos + 1]
	let b = data[pos + 2]

	return Math.max(r, g, b) / 255 // normalize brightness
}

function note_strength(note, samples=20) {
	note = note_index(note)
	let columnWidth = parser.video.videoWidth / notes.length
	let start = Math.floor(note * columnWidth)
	let stop  = Math.floor((note + 1) * columnWidth - 1)

	let midpoint = (start + stop) / 2
	let sum, lsum, rsum 
	sum = lsum = rsum = 0	

	// calculate the percentage of each side of the column that the note fills
	for(let x = start; x < stop; x += columnWidth / samples) {
		let sample = window_pixel(Math.floor(x)) > brightness_cutoff
		sum += sample
		if( x < midpoint ) {
			lsum += sample
		} else {
			rsum += sample
		}
	}
	return {
		total: sum / samples, // % of column that's lit up
		left: lsum / samples * 2,
		right: rsum / samples * 2
	}
}

function pressed_notes() {
	// get the strength of every note, list the ones that pass the threshold
	pressed = []
	for(let note of notes) {
		let strength = note_strength(note)
		if(strength.total > note_strength_cutoff) {
			pressed.push(note)
		} else {
			// if the left side is dark, but the right side is filled
			if(strength.left < note_strength_cutoff &&
				strength.right > note_strength_cutoff) {
				// note is sharp
				pressed.push(sharpen(note))
			}

			// if the right side is dark, but the left is filled
			if(strength.right < note_strength_cutoff &&
				strength.left > note_strength_cutoff) {
				// note is flat
				pressed.push(flatten(note))
			}
		}
	}
	return pressed
}

function draw_columns() {
	// (for debug) draw where the calculated column positions are

	// draw background for text
	let note_name_y = 30
	let note_name_height = 10
	parser.c.fillStyle = "#000000aa"
	parser.c.fillRect(0, note_name_y - note_name_height, parser.canvas.width, note_name_height * 2)

	for(let i = 0; i < notes.length; i++) {
		parser.c.strokeStyle = "#99999922"
		parser.c.lineWidth = .3
		parser.c.moveTo(parser.keywidth * i, 10) // can't do to the top, because the program reads the canvas
		parser.c.lineTo(parser.keywidth * i, parser.canvas.width)
		parser.c.stroke()

		parser.c.fillStyle    = "white"
		parser.c.textAlign    = "center"
		parser.c.textBaseline = "middle"
		parser.c.fillText(notes[i], parser.keywidth * i + min_keywidth, note_name_y)
	}
}

function reset(e) {
	// clean up events and variables
	if(e.key == "r") {
		document.body.removeChild(parser.canvas)
		clearInterval(interval)
		window.removeEventListener("keydown", reset)
		resetting = true

		console.clear()
		console.log("reset functions")
	}
}

function record_video() {
	// start the video scan
	capturing_video = true 
	parser.video.currentTime = 0
	parser.video.playbackRate = video_speed
	parser.video.play()
}

function make_sheet_music(midi) {
	// for testing in the other file
	navigator.clipboard.writeText(JSON.stringify(midi))
}

var midi_data    = []
var prev_notes   = []
var active_notes = {}
function update() {
	parser.c.clearRect(0, 0, parser.canvas.width, parser.canvas.height)
	parser.c.drawImage(parser.video, 0, 0, parser.video.videoWidth, clip_height, 0, 0, parser.video.videoWidth, clip_height)
	capture_data()
	//console.log(parser.video.currentTime) // in seconds
	//if(pressed_notes().length > 0) console.log(pressed_notes())
	// draw_columns()

	if (capturing_video) {
		let cur_notes = pressed_notes()

		// if note starts, record its start time
		for(let note of cur_notes) {
			if(!prev_notes.includes(note)) {
				active_notes[note] = parser.video.currentTime
			}
		}

		// if a note ends calculate how long it was held, and add it to midi list
		for(let note of prev_notes) {
			if(!cur_notes.includes(note)) {
				note_duration = parser.video.currentTime - active_notes[note]

				midi_data.push({
					"note": note,
					"start_time": active_notes[note],
					"duration": note_duration
				})

				delete active_notes[note]
			}
		}

		prev_notes = cur_notes

		// stop a few seconds before the video ends, to avoid youtube auto next
		if(parser.video.currentTime >= parser.video.duration - 3) {
			parser.video.pause()
			capturing_video = false
			make_sheet_music(midi_data)
		}
	}

	if(!resetting) requestAnimationFrame(update)
}

parser = new VideoParser()
var clip_height = parser.canvas.height
requestAnimationFrame(update)
record_video()
window.addEventListener("keydown", reset)
