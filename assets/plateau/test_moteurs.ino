// Test des trois muscles du plateau
#include <Servo.h>

const int PIN_SERVO[3] = {9, 10, 11};   // servos A, B, C
bool JUSTE_CENTRER = true;   // true = les bras se mettent au milieu et ne bougent plus

Servo servo[3];

void bouger(int angle) {               // angle : 0 = milieu, + = un sens, - = l'autre
  for (int i = 0; i < 3; i++) servo[i].writeMicroseconds(1500 + angle * 11.1);
}

void setup() {
  for (int i = 0; i < 3; i++) servo[i].attach(PIN_SERVO[i]);
  bouger(0);                           // 1500 microsecondes = le milieu
}

void loop() {
  if (JUSTE_CENTRER) return;           // on ne bouge plus
  bouger(20);   delay(1500);           // les trois bras d'un côté…
  bouger(0);    delay(1500);
  bouger(-20);  delay(1500);           // …puis de l'autre
  bouger(0);    delay(1500);
}
