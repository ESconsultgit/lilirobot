// Testing the plate's three muscles
#include <Servo.h>

const int PIN_SERVO[3] = {9, 10, 11};   // servos A, B, C
bool JUST_CENTRE = true;     // true = the arms go to the middle and stay still

Servo servo[3];

void move(int angle) {                 // angle: 0 = middle, + = one way, - = the other
  for (int i = 0; i < 3; i++) servo[i].writeMicroseconds(1500 + angle * 11.1);
}

void setup() {
  for (int i = 0; i < 3; i++) servo[i].attach(PIN_SERVO[i]);
  move(0);                             // 1500 microseconds = the middle
}

void loop() {
  if (JUST_CENTRE) return;             // stay still
  move(20);   delay(1500);             // all three arms one way…
  move(0);    delay(1500);
  move(-20);  delay(1500);             // …then the other
  move(0);    delay(1500);
}
