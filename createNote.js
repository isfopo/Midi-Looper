const max = require("max-api");

let notes = [];
let existingNotes = [];

max.addHandler("existingNotes", (dict) => {
  existingNotes = dict.notes;
})

max.addHandler("noteOn", (pitch, start_time, abs_start_time, velocity) => {
  if (existingNotes.filter(note => note.pitch === pitch && note.start_time.toFixed(1) === start_time.toFixed(1)).length === 0 ) {
    notes.push({ pitch, start_time, abs_start_time, velocity });
    max.post("note not in clip");
  } else {
    max.post("note is in clip");
  }
});

max.addHandler("noteOff", (pitch, abs_end_time) => {
  if (notes.length > 0) {
    const note = notes.filter(note => note.pitch === pitch)[0]; // should loop thru notes
    max.post(note);
    if (note) {
      max.outlet({ 
        pitch: note.pitch, 
        start_time: note.start_time, 
        duration: abs_end_time - note.abs_start_time,
        velocity: note.velocity
      });
      notes = notes.filter(note => note.pitch !== pitch);
    }
  }
});