// DECLARE VARS

// servo 1 vars
var servo1Slider = document.getElementById("servo1Slider");
var dispPosServo1 = document.getElementById("dispPosServo1");
const sliders = document.querySelectorAll(".slider");
var servo1Pos = servo1Slider.value;
dispPosServo1.innerHTML = servo1Pos; // Display the default slider value

// servo 2 vars
var servo2Slider = document.getElementById("servo2Slider");
var dispPosServo2 = document.getElementById("dispPosServo2");
var servo2Pos = servo2Slider.value;
dispPosServo2.innerHTML = servo2Pos; // Display the default slider value

// communication vars
const connectBtn = document.getElementById("connect");
const textEncoder = new TextEncoderStream(); // encoder for the writer.
const textDecoder = new TextDecoderStream(); // decoder for the reader.

let port; // create port variable
let writer; // create writer variable.
let reader; // creates reader variable.

// What to do when connect button is pressed
connectBtn.addEventListener("click", async () => {
  try {
    // SET UP FOR SPECIFIC PORT
    port = await navigator.serial.requestPort(); // Popup that lets user select a port.
    await port.open({baudRate: 9600}); // Tell it we want to connect at a baudrate of 9600.

    console.log("Port opened!"); // Troubleshoot to make sure port connected properly.

    // SET UP READER AND WRITER VARS
    writableSteamClosed = textEncoder.readable.pipeTo(port.writable); // Set up encoder for writer.
    writer = textEncoder.writable.getWriter(); // Initialize writer.

    readableStreamClosed = port.readable.pipeTo(textDecoder.writable); // Set up decoder for reader.
    reader = textDecoder.readable.getReader(); // Initialize reader variable.
    readFromPort(); // Start read from port function.

    servo1Slider.disabled = false;
    servo2Slider.disabled = false;
  } catch (e) {
    // Error occurs when selecting a device
    console.error("An error occured when selecting a serial port.");
  }
});

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

function sendMessage(message) {
  try {
    writer.write(message);
    console.log("Sent \"" + message + "\" to arduino");
  } catch (e) {
    console.log("Could not send message to port.");
  }
}

// Pulse animation on connect button if user hovers over 
// either slider while disabled
sliders.forEach(slider => {
  slider.addEventListener("mouseenter", () => {
    if(slider.disabled) {
      connectBtn.classList.add("pulse");
    }
  })
  slider.addEventListener("mouseleave", () => {
    connectBtn.classList.remove("pulse");
  })
})

servo1Slider.oninput = function() {
  servo1Pos = this.value;
  dispPosServo1.innerHTML = servo1Pos;
  sendMessage("servo1:"+servo1Pos+".");
}


servo2Slider.oninput = function() {
  servo2Pos = this.value;
  dispPosServo2.innerHTML = servo2Pos;
  sendMessage("servo2:"+servo2Pos+".");
}