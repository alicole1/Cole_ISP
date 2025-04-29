// DECLARE VARS

// servo vars
const servo1Btn = document.getElementById("servo1Submit");
const servo2Btn = document.getElementById("servo2Submit");
let servo1Degree;
let servo2Degree;

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

    servo1Btn.disabled = false;
    servo2Btn.disabled = false;
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

servo1Btn.onclick = function(){
    servo1Degree = document.getElementById("servo1").value;
    sendMessage("servo1:"+servo1Degree+".");
};

servo2Btn.onclick = function(){
    servo2Degree = document.getElementById("servo2").value;
    sendMessage("servo2:"+servo2Degree+".");
};

function sendMessage(message) {
  try {
    writer.write(message);
    console.log("Sent \"" + message + "\" to arduino");
  } catch (e) {
    console.log("Could not send message to port.");
  }
}