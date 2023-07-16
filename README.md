# Sheet Music Transcriber

### TODO
- process video
  - make sure the beginning notes are recorded
  - Organise midi in terms of beats, not time (based on first note start time)
    - find most common length set as quarter note, everything else is a number of quarter notes, convert from there
  - analyze MIDI to indentify the note types (whole, quarter, eighth, etc.)
  - make tie group for unusual note durations (eg a 7/8 th note written as half tied with quarter tied with eighth (1/2 + 1/4 + 1/8 = 7/8) )

- generate sheet music with VexFlow
  - generate multiple pages (hide all but first page for editing)
    - download (svg or pdf option)
      - convert to pdf

  - make is_bass_clef(voice_notes) function that works on entire bar to avoid single notes rendered as if on wrong clef
    - use this to center rests
