// --------------------------------------------------------------------------------------------------------------------------------------
// C O N N E C T I O N
// --------------------------------------------------------------------------------------------------------------------------------------

// connection VARIABLES ---------------------------------------------------------------------------------- VARIABLES
var connectBtn = document.getElementById("connect");
const textEncoder = new TextEncoderStream(); // encoder for the writer.
const textDecoder = new TextDecoderStream(); // decoder for the reader.

let port; // create port variable.
let writer; // create writer variable.
let reader; // creates reader variable.

// connection BUTTONS ---------------------------------------------------------------------------------- BUTTONS
// what to do when connect button is pressed.
connectBtn.addEventListener("click", async () => {
  try {
    // set up for specific port.
    port = await navigator.serial.requestPort(); // Popup that lets user select a port.
    await port.open({baudRate: 9600}); // Tell it we want to connect at a baudrate of 9600.

    console.log("Port opened!"); // Troubleshoot to make sure port connected properly.

    // set up readeer and writer variables.
    writableSteamClosed = textEncoder.readable.pipeTo(port.writable); // Set up encoder for writer.
    writer = textEncoder.writable.getWriter(); // Initialize writer.

    readableStreamClosed = port.readable.pipeTo(textDecoder.writable); // Set up decoder for reader.
    reader = textDecoder.readable.getReader(); // Initialize reader variable.
    readFromPort(); // Start read from port function.

    servo1Slider.disabled = false;
    servo2Slider.disabled = false;
  } catch (e) {
    // error occurs when selecting a device
    console.error("An error occured when selecting a serial port.");
  }
});

// connection METHODS ---------------------------------------------------------------------------------- METHODS
// interpret messages coming from the arduino and display to console.
async function readFromPort() {
  let myArray = ["Arduino message: "];
  while (port.readable) {
    try {
      while (true) {
        const { value, done } = await reader.read(); 
        if (done) {
          // Allow the serial port to be closed later.
          reader.releaseLock();
          break;
        }
        if (value) {
        // add value to an array.
        // fixes the issue i had where messages would print choppy.
        // print the whole array (one message) after reading a /n
          myArray.push(value);
          if (value.includes('\n')) {
            console.log(myArray.join(""));
            myArray = ["Arduino message: "]
          }
        }
      }
    } catch (e) {
      // TODO: Handle non-fatal read error.
    }
  }
}

// send messages to the arduino.
function sendMessage(message) {
  try {
    writer.write(message);
    console.log("Sent \"" + message + "\" to arduino");
  } catch (e) {
    console.log("Could not send message to port.");
  }
}

// --------------------------------------------------------------------------------------------------------------------------------------
// K E Y B O A R D    I N P U T S    A N D    A R M    P O S I T I O N
// --------------------------------------------------------------------------------------------------------------------------------------

// keyboard VARIABLES -------------------------------------------------------------------------- VARIABLES
// object to store arm positions
const armPositions = {
    base: 0,
    shoulder: 0,
    elbow: 0,
    wrist: 0,
    scoop: 0,
};

// keyboard INPUTS ---------------------------------------------------------------------------- INPUTS
// listen for keyboard inputs to move the robot.
document.addEventListener('keydown', function(event) {
    switch (event.key) {
        case 'a': // move base left.
            changePosition("base", -1);
            hasPressedA = true;
            document.getElementById("baseLeftImg")?.classList.add("completed");
            break;
        case 'd': // move base right.
            changePosition("base", 1);
            hasPressedD = true;
            document.getElementById("baseRightImg")?.classList.add("completed");
            break;

        case 'w': // move shoulder up.
            changePosition("shoulder", 1);
            hasPressedW = true;
            document.getElementById("shoulderUpImg")?.classList.add("completed");
            break;
        case 's': // move shoulder down.
            changePosition("shoulder", -1);
            hasPressedS = true;
            document.getElementById("shoulderDownImg")?.classList.add("completed");
            break;

        case 'i': // move elbow up.
            changePosition("elbow", 1);
            hasPressedI = true;
            document.getElementById("elbowUpImg")?.classList.add("completed");
            break;
        case 'k': // move elbow down.
            changePosition("elbow", -1);
            hasPressedK = true;
            document.getElementById("elbowDownImg")?.classList.add("completed");
            break;

        case 'j': // move wrist left.
            changePosition("wrist", -1);
            hasPressedJ = true;
            document.getElementById("wristLeftImg")?.classList.add("completed");
            break;
        case 'l': // move wrist right.
            changePosition("wrist", 1);
            hasPressedL = true;
            document.getElementById("wristRightImg")?.classList.add("completed");
            break;
    }

    if (tutorialPage === 1 && hasPressedA && hasPressedD) {
      nextBtn.disabled = false;
    } else if (tutorialPage === 2 && hasPressedW && hasPressedS) {
      nextBtn.disabled = false;
    } else if (tutorialPage === 3 && hasPressedI && hasPressedK) {
      nextBtn.disabled = false;
    } else if (tutorialPage === 4 && hasPressedJ && hasPressedL) {
      nextBtn.disabled = false;
    }

});

// send current position of all parts of the arm to the console when this button is clicked.
document.getElementById("checkPos").addEventListener("click", checkPosition);

// METHODS -------------------------------------------------------------------------------------------- METHODS
// move the robot
function changePosition(part, change) {
    var changeAmount = 5;
    if (armPositions.hasOwnProperty(part)) {
        armPositions[part] += (change * changeAmount);
        if (armPositions[part] > 180) {
            armPositions[part] = 180;
        } else if (armPositions[part] < 0) {
            armPositions[part]= 0;
        }
        checkPosition();
    }
    sendMessage(part+":"+armPositions[part]+".");
}

// display current position of all arm parts to console.
function checkPosition() {
    console.log("Base position: " + armPositions.base + 
        "\nShoulder position: " + armPositions.shoulder + 
        "\nElbow position: " + armPositions.elbow + 
        "\nWrist position: " + armPositions.wrist + 
        "\n______________________");
}

// --------------------------------------------------------------------------------------------------------------------------------------
// T U T O R I A L
// --------------------------------------------------------------------------------------------------------------------------------------

// popup VARIABLES ---------------------------------------------------------------------------------- VARIABLES
const popupContainer = document.getElementById("popupContainer");
const popupContent = document.getElementById("popupContent");
const nextBtn = document.getElementById("nextPopup");
const prevBtn = document.getElementById("prevPopup");
const startBtn = document.getElementById("startTutorial");
const navStartBtn = document.getElementById("nav-tutorial");

const tutorialSteps = [
  // WELCOME PAGE
    `
      <h2>Welcome to the tutorial</h2>
      <p>Navigate using the "Next" and "Previous" buttons below.</p>
      <p>You can return to this tutorial at any point.</p>
    `,
  
  // MOVE BASE -- DONE
    `
      <h3>Rotating the Base</h3>
      <div class="image-row">
        <div class="image-box">
          <img id="baseLeftImg" src="media/baseLeft.png" alt="Rotate base left" />
          <p>Hold “A” to rotate the base left</p>
        </div>
        <div class="image-box">
          <img id="baseRightImg" src="media/baseRight.png" alt="Rotate base right"/>
          <p>Hold “D” to rotate the base right</p>
        </div>
      </div>
    `,

  // MOVE SHOULDER -- DONE
    `
      <h3>Rotating the Shoulder</h3>
      <div class="image-row">
        <div class="image-box">
          <img id="shoulderUpImg" src="media/shoulderUp.png" alt="Swing shoulder up" />
          <p>Hold “W” to swing the shoulder up</p>
        </div>
        <div class="image-box">
          <img id="shoulderDownImg" src="media/shoulderDown.png" alt="Swing shoulder down"/>
          <p>Hold “S” to swing the shoulder down</p>
        </div>
      </div>
    `,
  
  // MOVE ELBOW -- DONE
      `
      <h3>Rotating the Elbow</h3>
      <div class="image-row">
        <div class="image-box">
          <img id="elbowUpImg" src="media/elbowUp.png" alt="Swing elbow up" />
          <p>Hold “I” to swing the elbow up</p>
        </div>
        <div class="image-box">
          <img id="elbowDownImg" src="media/elbowDown.png" alt="Swing elbow down"/>
          <p>Hold “K” to swing the elbow down</p>
        </div>
      </div>
    `,

  // MOVE WRIST
      `
      <h3>Rotating the Elbow</h3>
      <div class="image-row">
        <div class="image-box">
          <img id="wristLeftImg" src="media/wristLeft.png" alt="Rotate wrist left" />
          <p>Hold “J” to rotate the wrist left</p>
        </div>
        <div class="image-box">
          <img id="wristRightImg" src="media/wristRight.png" alt="Rotate wrist right"/>
          <p>Hold “L” to rotate the wrist right</p>
        </div>
      </div>
    `,
]

let tutorialPage = 0;

// bools to check if keys have been pressed (for completetion)
let hasPressedA = false;
let hasPressedD = false;

let hasPressedW = false;
let hasPressedS = false;

let hasPressedJ = false;
let hasPressedL = false;

let hasPressedI = false;
let hasPressedK = false; 

// tutorial BUTTONS ---------------------------------------------------------------------------------- BUTTONS

// button that starts the tutorial from the nav bar
navStartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  tutorialPage = 0;
  showStep(tutorialPage);
  popupContainer.style.display = "block";
});

// button that starts the tutorial
startBtn.addEventListener("click", () => {
  tutorialPage = 0;
  showStep(tutorialPage); 
  popupContainer.style.display = "block";
});

// if next button is clicked, go to next slide
nextBtn.addEventListener("click", () => {
    if (tutorialPage < tutorialSteps.length - 1) {
      tutorialPage++;
      showStep(tutorialPage);
    } else {
      popupContainer.style.display = "none";
    }
});

// if the previous button is clicked, go to previous slide
prevBtn.addEventListener("click", () => {
    if (tutorialPage > 0) {
      tutorialPage--;
      showStep(tutorialPage);
    }
});

// tutorial METHODS ---------------------------------------------------------------------------------- METHODS
// update popup for current slide in tutorial
function showStep(index) {
  if (index === 0) {
    nextBtn.disabled = false;
  } else {
    nextBtn.disabled = true;
  }
  prevBtn.style.display = index > 0 ? "inline-block" : "none"; // if on first page, hide the previous button.
  nextBtn.textContent = index === tutorialSteps.length - 1 ? "Close" : "Next"; // if on last page, the button says close instead of next.

  switch (index) {
    case 1: // BASE
      hasPressedA = false;
      hasPressedD = false;
      break;
    case 2: // SHOULDER
      hasPressedW = false;
      hasPressedS = false;
      break;
    case 3: // ELBOW
      hasPressedI = false;
      hasPressedK = false;
      break;
    case 4: // WRIST
      hasPressedJ = false;
      hasPressedL = false;
      break;
  }
  popupContent.innerHTML = tutorialSteps[index]; // displays html from array for given index
}

