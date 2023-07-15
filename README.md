# Sheet Music Transcriber

### TODO
- process video
  - make sure the beginning notes are recorded
  - Organise midi in terms of beats, not time (based on first note start time)
    - find most common length set as quarter note, everything else is a number of quarter notes, convert from there
  - analyze MIDI to indentify the note types (whole, quarter, eighth, etc.)
- generate sheet music with VexFlow
  - generate multiple pages
  - download (svg or pdf option)
    - convert to pdf
  - do tied notes for holding down as well as longer notes (combinations that can't be written with a single note, and for context when a hold note (4th) is sourrounded by 8ths)
