void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Connected to serial monitor");
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("Send Message? ");
  while (Serial.available() == 0) { }

  String incomingString = Serial.readString();
  // int incomingInt = Serial.read();
  Serial.print("Received: " + incomingString);
}
