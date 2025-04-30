const showPopupBtn = document.getElementById("showPopupBtn");
const popup = document.getElementById("popup");
const addServoBtn = document.getElementById("addServoBtn");
const buttonContainer = document.getElementById("buttonContainer");

showPopupBtn.addEventListener('click', function() {
    popup.style.display = "block";
})

addServoBtn.addEventListener('click', function() {
    myName = document.getElementById("servoName").value;
    myPosition = document.getElementById("servoPosition").value;
    myPort = document.getElementById("servoPort").value;

    var myServo = new Servo(myName, myPosition, myPort);
    myServo.displayInfo();

    const servoBtn = document.createElement("button");
    servoBtn.textContent = `Show ${myServo.name}`;
    servoBtn.addEventListener('click', function() {
        myServo.displayInfo();
    })

    buttonContainer.appendChild(servoBtn);

    popup.style.display = "none";
})

class Servo {
    constructor(name, position, port) {
        this.name = name;
        this.position = position;
        this.port = port;
    }

    displayInfo() {
        console.log("Servo name: " + this.name);
        console.log("Position: " + this.position);
        console.log("Port: " + this.port);
    }
}
