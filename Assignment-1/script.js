// Array of column objects - each one holds the theme colours and word list for that column
var columns = [
  {
    label:      "Who?",        // label shown under the button
    color:      "#7c3aed",     // border and circle colour
    lightColor: "#ede9fe",     // button background colour
    textColor:  "#4c1d95",     // button text colour
    words: [
      "The turkey", "Mom", "Dad", "The dog", "My teacher",
      "The elephant", "The cat", "A wizard", "My robot", "The dragon"
    ]
  },
  {
    label:      "Did what?",
    color:      "#dc2626",
    lightColor: "#fee2e2",
    textColor:  "#7f1d1d",
    words: [
      "sat on", "ate", "danced with", "saw", "doesn't like",
      "kissed", "chased", "tickled", "sang to", "jumped over"
    ]
  },
  {
    label:      "What kind?",
    color:      "#16a34a",
    lightColor: "#dcfce7",
    textColor:  "#14532d",
    words: [
      "a funny", "a scary", "a goofy", "a slimy", "a barking",
      "a fat", "a tiny", "a sparkly", "a purple", "a grumpy"
    ]
  },
  {
    label:      "What?",
    color:      "#d97706",
    lightColor: "#fef3c7",
    textColor:  "#78350f",
    words: [
      "goat", "monkey", "fish", "cow", "frog",
      "bug", "worm", "chicken", "porcupine", "hamster"
    ]
  },
  {
    label:      "Where?",
    color:      "#db2777",
    lightColor: "#fce7f3",
    textColor:  "#831843",
    words: [
      "on the moon", "on the chair", "in my spaghetti",
      "in my soup", "on the grass", "in my shoes",
      "at the park", "on the roof", "in a puddle", "at school"
    ]
  }
];

// Tracks which word is currently showing in each column
// One number per column, starts at 0 (first word in each array)
var indices = [0, 0, 0, 0, 0];


// buildUI()
// Runs once on page load
// Loops through the columns array and creates all the buttons and preview chips
function buildUI() {

  // Get the two containers from the HTML
  var wrapper = document.getElementById("columnsWrapper");
  var preview = document.getElementById("previewRow");

  // Clear anything already inside (useful if reset is called)
  wrapper.innerHTML = "";
  preview.innerHTML = "";

  // Loop once for each column
  for (var i = 0; i < columns.length; i++) {

    var col = columns[i];

    // Create the column container div
    var colDiv = document.createElement("div");
    colDiv.className = "word-column";

    // Create the numbered circle at the top of the column
    var numCircle = document.createElement("div");
    numCircle.className = "col-number";
    numCircle.style.background = col.color;
    numCircle.textContent = i + 1;
    colDiv.appendChild(numCircle);

    // Create the word button
    var btn = document.createElement("button");
    btn.className = "word-btn";
    btn.id = "btn-" + i;
    btn.style.background  = col.lightColor;
    btn.style.color       = col.textColor;
    btn.style.borderColor = col.color;
    btn.textContent = col.words[indices[i]]; // show the first word

    // Use a closure so each button remembers its own column index when clicked
    btn.onclick = (function(colIndex) {
      return function() { cycleWord(colIndex); };
    })(i);

    colDiv.appendChild(btn);

    // Create the label below the button (e.g. "Who?")
    var lbl = document.createElement("div");
    lbl.className   = "col-label";
    lbl.textContent = col.label;
    colDiv.appendChild(lbl);

    // Add the finished column to the wrapper
    wrapper.appendChild(colDiv);

    // Create the preview chip shown below all columns
    var chip = document.createElement("div");
    chip.className         = "preview-chip";
    chip.id                = "chip-" + i;
    chip.style.background  = col.lightColor;
    chip.style.color       = col.textColor;
    chip.style.borderColor = col.color;
    chip.textContent       = col.words[indices[i]];
    preview.appendChild(chip);
  }
}


// cycleWord(colIndex)
// Called when the user clicks a column button
// Moves to the next word in that column's array
// Wraps back to 0 when it reaches the end
function cycleWord(colIndex) {

  // Increase the index by 1, wrap around using modulo
  indices[colIndex] = (indices[colIndex] + 1) % columns[colIndex].words.length;

  // Get the new word
  var newWord = columns[colIndex].words[indices[colIndex]];

  // Update the button and preview chip to show the new word
  document.getElementById("btn-"  + colIndex).textContent = newWord;
  document.getElementById("chip-" + colIndex).textContent = newWord;

  // Clear the story output so stale text doesn't remain
  clearStory();
}


// getStory()
// Builds the full sentence from all 5 current selections
// Returns it as a single string
function getStory() {
  var parts = [];
  for (var i = 0; i < columns.length; i++) {
    parts.push(columns[i].words[indices[i]]);
  }
  // Join with spaces and add a period at the end
  return parts.join(" ") + ".";
}


// tellStory()
// Grabs the finished sentence and displays it in the output area
function tellStory() {
  var el = document.getElementById("storyDisplay");
  el.className   = "story-text";
  el.textContent = "\u{1F4D6} " + getStory();
}


// randomStory()
// Picks a random word index for every column
// Updates all buttons and chips, then shows the story
function randomStory() {
  for (var i = 0; i < columns.length; i++) {

    // Math.random() gives a decimal between 0 and 1
    // Multiply by the array length and floor it to get a whole number index
    indices[i] = Math.floor(Math.random() * columns[i].words.length);

    // Update the button and chip to match the new random word
    document.getElementById("btn-"  + i).textContent = columns[i].words[indices[i]];
    document.getElementById("chip-" + i).textContent = columns[i].words[indices[i]];
  }

  // Show the randomly generated story
  tellStory();
}


// resetAll()
// Sets every column back to its first word (index 0)
// Clears the story output
function resetAll() {
  for (var i = 0; i < columns.length; i++) {
    indices[i] = 0;
    document.getElementById("btn-"  + i).textContent = columns[i].words[0];
    document.getElementById("chip-" + i).textContent = columns[i].words[0];
  }
  clearStory();
}


// clearStory()
// Resets the output area back to the grey placeholder message
function clearStory() {
  var el = document.getElementById("storyDisplay");
  el.className   = "story-placeholder";
  el.textContent = "Click each column to pick your words, then press \u201CTell My Story!\u201D";
}


// Start everything up when the page loads
buildUI();