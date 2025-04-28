void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Connected to serial monitor");
}

void loop() {
  // put your main code here, to run repeatedly:
  Serial.println("HIIII You did it!");
  delay(1000);
}
