// add vexflow libary, for displaying the sheet music after its generated
//var script = document.createElement("script")
//script.src = "https://cdn.jsdelivr.net/npm/vexflow/build/cjs/vexflow.js"

let params = location.search // contains video ID

class VideoParser {
	constructor () {
		this.video  = document.querySelector("video")
		this.canvas = document.createElement("canvas")
		this.c 	    = this.canvas.getContext("2d", {willReadFrequently: true})

		this.canvas.width  = this.video.videoWidth
		this.canvas.height = 15
		this.canvas.style.position = "fixed"
		this.canvas.style.bottom   = 0
		this.canvas.style.right    = 0
		
		document.body.appendChild(this.canvas)

		// constants
		this.keywidth     = this.video.videoWidth / notes.length
		this.min_keywidth = this.keywidth / 2
	}

}

function parse_note_list(lst) {
	return lst.trim()
			.replaceAll("\n", " ")
			.replaceAll("\t", "")
			.replaceAll("  ", " ")
			.split(" ")
}

//#region Constants
const notes_lists = {
	"A0-F7": parse_note_list(`
		A0 B0
		C1 D1 E1 F1 G1 A1 B1
		C2 D2 E2 F2 G2 A2 B2 
		C3 D3 E3 F3 G3 A3 B3 
		C4 D4 E4 F4 G4 A4 B4 
		C5 D5 E5 F5 G5 A5 B5
		C6 D6 E6 F6 G6 A6 B6 
		C7 D7 E7 F7
	`),
	"A0-D7": parse_note_list(`
		A0 B0
		C1 D1 E1 F1 G1 A1 B1
		C2 D2 E2 F2 G2 A2 B2 
		C3 D3 E3 F3 G3 A3 B3 
		C4 D4 E4 F4 G4 A4 B4 
		C5 D5 E5 F5 G5 A5 B5
		C6 D6 E6 F6 G6 A6 B6 
		C7 D7
	`),
	"A0-C8": parse_note_list(`
		A0 B0
		C1 D1 E1 F1 G1 A1 B1
		C2 D2 E2 F2 G2 A2 B2 
		C3 D3 E3 F3 G3 A3 B3 
		C4 D4 E4 F4 G4 A4 B4 
		C5 D5 E5 F5 G5 A5 B5
		C6 D6 E6 F6 G6 A6 B6 
		C7 D7 E7 F7 G7 A7 B7 
		C8
	`)
}
var notes = notes_lists["A0-C8"]

const sharps = ["C", "D", "F", "G", "A"] // notes that have a sharp
const fps    = 24
//#endregion

var window_y = 0
let brightness_cutoff = .5
let note_strength_cutoff = .55
var resetting = false
var capturing_video = false
var video_speed = 1//2

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

	let pressed = pressed_notes()
	for(let i = 0; i < notes.length; i++) {
		// column highlight
		if(pressed.includes(notes[i])) {
			parser.c.fillStyle = "red"
			parser.c.fillRect(parser.keywidth * i, 10, parser.keywidth, parser.canvas.width)
		}
		if(pressed.includes(sharpen(notes[i]))) {
			parser.c.fillStyle = "red"
			parser.c.fillRect(parser.keywidth * i + parser.keywidth/2, 10, parser.keywidth/2, parser.canvas.width)
		}
		if(pressed.includes(flatten(notes[i]))) {
			parser.c.fillStyle = "red"
			parser.c.fillRect(parser.keywidth * i, 10, parser.keywidth/2, parser.canvas.width)
		}

		// column line
		parser.c.strokeStyle = "#99999922"
		parser.c.lineWidth = .3
		parser.c.moveTo(parser.keywidth * i, 10) // can't do to the top, because the program reads the canvas
		parser.c.lineTo(parser.keywidth * i, parser.canvas.width)
		parser.c.stroke()

		// note label
		parser.c.fillStyle    = "white"
		parser.c.textAlign    = "center"
		parser.c.textBaseline = "middle"
		parser.c.fillText(notes[i], parser.keywidth * i + parser.keywidth, note_name_y)
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
	// insert name and author in MIDI
	let title = document.querySelector("#title > h1 > yt-formatted-string").innerText
	let subtitle = document.querySelector("#text > a").innerText
	midi = {title, subtitle, midi}

	// copy the MIDI to be converted to sheet music
	let str = JSON.stringify(midi)
	btn.innerText = "Copy MIDI"
	btn.onclick = () => {
		navigator.clipboard.writeText(str)
		btn.innerText = "Copied ✓"
		setTimeout(() => {
			btn.innerText = "Copy MIDI"
		}, 3000);
	}
}

var midi_data    = []
var prev_notes   = []
var active_notes = {}

const ROUND_PRECISION = 10
const round = (x, n=ROUND_PRECISION) => Math.round(x* 10**n)/10**n

function update() {
	parser.c.clearRect(0, 0, parser.canvas.width, parser.canvas.height)
	parser.c.drawImage(parser.video, 0, 0, parser.video.videoWidth, clip_height, 0, 0, parser.video.videoWidth, clip_height)
	capture_data()
	//console.log(parser.video.currentTime) // in seconds
	//if(pressed_notes().length > 0) console.log(pressed_notes())
	draw_columns()

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
					"start_time": round(active_notes[note]),
					"duration": round(note_duration)
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

var btn
function add_button() {
	// monitor video id to reset the button if the video changes
	setInterval(() => {
		if(location.search != params) {
			// reset button
			btn.innerText = "Sheet Music"
			btn.onclick = generate_sheet
			midi_data = []
			params = location.search
		}
	}, 5000)
	
	add_style(`
		#sheet-music-button:hover {
			background: linear-gradient(45deg, #e52d2799, #8e191c99);
		}
		#sheet-music-button {
			/*background-color: #b31217;*/
			background: linear-gradient(45deg, #e52d27, #8e191c);
			padding: .75em 1.4em;
			border-radius: 2em;
			margin-left: 1.5em;
			font-weight: 410;
			font-family: "Roboto", "Arial", sans-serif;
			font-size: 14px;
			text-wrap: nowrap;
		}
	`)

	btn = document.createElement("div")
	btn.id = "sheet-music-button"
	btn.innerText = "Sheet Music"

	btn.onclick = generate_sheet

    let panel = document.querySelector("#owner")
		panel.appendChild(btn)
}

function add_style(css) {
	let style = document.createElement("style")
		style.innerHTML = css
	document.head.appendChild(style)
}

var clip_height
function generate_sheet() {
	add_style(`
		#generate-settings-menu {
			position: fixed;
			inset: 50% 50%;
			padding: 2em;
			transform: translate(-50%, -50%);

			background-color: #252525;
			color: white;
			text-align: center;

			width: 30%;
    		height: 40%;

			font-size: 10pt;
			border-radius: 1em;
		}

		.settings-row {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;

			padding-top: 1em;
		}

		#generate-settings-menu input, #generate-settings-menu select {
			background-color: #101010;
			border: none;
			outline: none;
			color: white;
			padding: .5em;
			width: 30%;
		}

		#start-btn {
			width: 100%;
			background: linear-gradient(45deg, #e52d27, #8e191c);
			border-radius: 2em;
			margin-top: 1.5em;
			padding: .75em 1.4em;
			box-sizing: border-box;

			font-weight: 410;
			font-family: "Roboto", "Arial", sans-serif;
			font-size: 14px;
			text-wrap: nowrap;
		}

		#start-btn:hover {
			background: linear-gradient(45deg, #e52d2799, #8e191c99);
		}

		#settings-background {
			background-color: #00000080;
			width: 100%;
			height: 100%;
			position: fixed;
		}
	`)

	// settings menu popup
	let background = document.createElement("div")
		background.id = "settings-background"

	let menu = document.createElement("div")
		menu.id = "generate-settings-menu"
		menu.innerHTML = `
			<h2>Transcribe Settings</h2>
			<br />
			<div class="settings-row">
				<p> note brightness </p>
				<input type="number" value="0.5" min="0" max="1" step=".05" id="brightness-cutoff" />
			</div>
			<div class="settings-row">
				<p> notes on screen </p>
				<select id="keys-visible" value="A0-C8">
					<option value="A0-C8">A0-C8</option>
					<option value="A0-C8">A0-F7</option>
					<option value="A0-D7">A0-D7</option>
				</select>
			</div>
			<div class="settings-row">
				<p> video speed </p>
				<input type="number" value="1" min="0" max="4" step=".1" id="video-speed" />
			</div>

			<div id="start-btn"> Start </div>
		`
	background.appendChild(menu)
	document.body.appendChild(background)

	// define events
	let speed = document.getElementById("video-speed")
	let start = document.getElementById("start-btn")
	let keys_visible = document.getElementById("keys-visible")
	let brightness   = document.getElementById("brightness-cutoff")

	speed.addEventListener("change", () => {
		video_speed = parseFloat(speed.value)
	})
	brightness.addEventListener("change", () => {
		brightness_cutoff = parseFloat(brightness.value)
	})
	keys_visible.addEventListener("change", () => {
		notes = notes_lists[keys_visible.value]
	})

	start.addEventListener("click", () => {
		document.body.removeChild(background)

		// scan the video
		btn.innerText = "Scanning Video..."
		parser = new VideoParser()
		clip_height = parser.canvas.height
		requestAnimationFrame(update)
		record_video()
		window.addEventListener("keydown", reset)
	})

}

add_button()
