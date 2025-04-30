#include <stdio.h>
#include <Servo.h>

Servo servo1;
Servo servo2;
String servo;
int int_pos;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
  Serial.println("Connected to serial monitor");
  servo1.attach(9);
  servo2.attach(10);
}

void loop() {
  // put your main code here, to run repeatedly:
  while (Serial.available() > 0) {
    servo = Serial.readStringUntil(':');
    if (servo != "\n" && servo.length() > 0) {
      String pos = Serial.readStringUntil('.');
      int_pos = pos.toInt();
      
      Serial.println("Servo: " + servo + " pos: " + pos);
      updateServo();
    }
  }
}

void updateServo() {
  if (servo.equals("servo1")) {
    servo1.write(int_pos);
  } else if (servo.equals("servo2")) {
    servo2.write(int_pos);
  }
}
