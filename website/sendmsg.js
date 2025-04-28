
// Declare variables:
const connectBtn = document.getElementById("connect");
const sendBtn = document.getElementById("send");
const textDecoder = new TextDecoderStream();

let port; // create port variable
let writer; // create writer variable.
let reader; // creates reader variable.

// What to do when connect button is pressed
connectBtn.addEventListener("click", async () => {
  try {
    port = await navigator.serial.requestPort();
    await port.open({baudRate: 9600}); // Tell it we want to connect at a baudrate of 9600.

    console.log("Port opened!");

    sendBtn.disabled = false; // Let user press send button.
    writer = port.writable.getWriter(); // Initialize writer.

    readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
    reader = textDecoder.readable.getReader(); // Initialize reader variable.

    readFromPort();
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


// Send button
sendBtn.addEventListener('click', async () => {
  try {
    const data = new Uint8Array([104, 101, 108, 108, 111]); // hello
    await writer.write(data);
    console.log("Sent \"hello!\" ");
  } catch (e) {
    console.log("Could not send message to port.");
  }
  
});
