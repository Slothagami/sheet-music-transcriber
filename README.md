# Sheet Music Transcriber

### TODO
- process video
  - make sure the beginning notes are recorded
  - Organise midi in terms of beats, not time (based on first note start time)
  - analyze MIDI to indentify the note types (whole, quarter, eighth, etc.)
- generate sheet music with VexFlow
  - generate multiple pages
  - add key signatures
  - do tied notes for holding down as well as longer notes (combinations that can't be written with a single note, and for context when a hold note (4th) is sourrounded by 8ths)
  - detect groups of notes that can be barred (2 or 4 consecutive 16th or 8th notes)
  - download (svg or pdf option)
    - convert to pdf
  - stems down on treble clef
