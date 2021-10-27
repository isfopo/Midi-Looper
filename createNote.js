const max = require("max-api");

let notes = [];
let existingNotes = [];

max.addHandler("existingNotes", (dict) => {
  existingNotes = dict.notes;
})

max.addHandler("noteOn", (pitch, start_time, abs_start_time, velocity) => {
  if (existingNotes.filter(note => note.pitch === pitch && note.start_time.toFixed() === start_time.toFixed()).length === 0 ) {
    notes.push({ pitch, start_time, abs_start_time, velocity });
    max.post("note not in clip");
  } else {
    max.post("note is in clip");
  }
});

max.addHandler("noteOff", async (pitch, abs_end_time) => {
  if (notes.length > 0) {
    const note = notes.find(note => note.pitch === pitch);
    if (note) {
      notes = notes.filter(note => note.pitch !== pitch);
      await max.outlet({ 
        pitch: note.pitch, 
        start_time: note.start_time, 
        duration: abs_end_time - note.abs_start_time,
        velocity: note.velocity
      });
    }
  }
});