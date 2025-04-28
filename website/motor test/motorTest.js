// DECLARE VARS

// motor vars
const motor1Btn = document.getElementById("motor1Submit");
const motor2Btn = document.getElementById("motor2Submit");
let motor1Degree;
let motor2Degree;

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

    motor1Btn.disabled = false;
    motor2Btn.disabled = false;
  } catch (e) {
    // Error occurs when selecting a device
    console.error("An error occured when selecting a serial port.");
  }
});

async function readFromPort() {
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
          console.log(value);
        }
      }
    } catch (e) {
      // TODO: Handle non-fatal read error.
    } 
  }
}

motor1Btn.onclick = function(){
    motor1Degree = document.getElementById("motor1").value;
    console.log(motor1Degree);
    sendMessage("servo1:"+motor1Degree+".");
};

motor2Btn.onclick = function(){
    motor2Degree = document.getElementById("motor2").value;
    console.log(motor2Degree);
    sendMessage("servo2:"+motor2Degree+".");
};

function sendMessage(message) {
  try {
    writer.write(message);
    console.log("Sent \"" + message + "\" to arduino");
  } catch (e) {
    console.log("Could not send message to port.");
  }
}