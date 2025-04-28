void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Connected to serial monitor");
}

void loop() {
  // put your main code here, to run repeatedly:
  while (Serial.available() > 0) {
    String servo = Serial.readStringUntil(':');
    if (servo != "\n" && servo.length() > 0) {
      String pos = Serial.readStringUntil('.');
      int int_pos = pos.toInt();
      
      Serial.println("Servo: " + servo + " pos: " + pos);
    }
  }

}
