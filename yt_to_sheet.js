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
`     .trim()
	.replaceAll("\n", " ")
	.replaceAll("\t", "")
	.replaceAll("  ", " ")
	.split(" ")

const sharps = ["C", "D", "F", "G", "A"] // notes that have a sharp

var video = document.querySelector("video")
var canvas = document.createElement("canvas")
var c = canvas.getContext("2d", {willReadFrequently: true})

// add vexflow libary, for displaying the sheet music after its generated
//var script = document.createElement("script")
//script.src = "https://cdn.jsdelivr.net/npm/vexflow/build/cjs/vexflow.js"

canvas.width = video.videoWidth
canvas.height = 10

canvas.style.position = "fixed"
canvas.style.bottom = 0
canvas.style.right = 0

document.body.appendChild(canvas)

function noteWindow(pos) {
	let data = c.getImageData(0, 0, video.videoWidth, 1).data
	let pixel = pos => {
		// arranged as RGBA, RGBA, ... for each pixel in order
		pos *= 4
	
		let r = data[pos]
		let g = data[pos + 1]
		let b = data[pos + 2]
	
		return (r + g + b) / 3
	}

	return pixel(pos)
}

function noteColumn(note) {
	let columnWidth = video.videoWidth / notes.length
	let brightnessCutoff = 40

	let sum = 0	
	for(let x = Math.floor(note * columnWidth); x < Math.floor(note * (columnWidth + 1)); x++) {
		sum += noteWindow(x) > brightnessCutoff
	}
	return sum / columnWidth // % of column that's lit up
}

function pressedKeys() {
	pressed = []
	
	// calculate position of each key, and check each one
	let keyWidth = video.videoWidth / notes.length
	for(let i = 0; i < notes.length - 1; i++) {
		
		let percentFilled = noteColumn(i) // percent of the column width thats lit up
		if(percentFilled > 0) {

			if(percentFilled > .7) {
				console.log(notes[i], noteColumn(i))
				pressed.push(notes[i])
			}
			
		}


		//let note_x = Math.round(keyWidth/2 + i * keyWidth)
		//if(noteWindow(note_x) > 40) {
		//	pressed.push(notes[i])
		//}

		// check sharp (if applicable)
		//if(sharps.includes(notes[i].charAt(0))) {
		//	if(noteWindow(note_x + keyWidth/2) > 40) {
		//		pressed.push(notes[i].replace(/(\w)(\d)/, "$1#$2")) // insert #
		//	}
		//}
	}
	return pressed
}

function drawCols() {

}


// TODO: Record notes to reconstruct as sheet music


var fps = 24
var interval = setInterval(() => {
	if( video.paused ) return
	c.drawImage(video, 0, 0)
	
	//console.log(video.currentTime) // in seconds
	if(pressedKeys().length > 0) console.log(pressedKeys())
}, 1000/fps)

// clean up the video
window.addEventListener("keydown", e => {
	if(e.key == "r") {
		document.body.removeChild(canvas)
		clearInterval(interval)
		console.log("reset functions")
	}
})
