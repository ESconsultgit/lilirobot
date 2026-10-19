// ===========================================================
//  The Balancer 2 · The Plate — the big program
//  The eyes: the touchscreen. The muscles: 3 servo motors.
// ===========================================================
#include <Servo.h>

// ----- The wiring -----
// The 4 touchscreen wires, in order: X+, Y+, X-, Y-
const int XP = A0;   // X+
const int YP = A1;   // Y+
const int XM = A2;   // X-
const int YM = A3;   // Y-
// Servo motors A, B, C (anticlockwise, seen from above)
const int PIN_SERVO[3] = {9, 10, 11};

// ----- Your calibration (step 8) -----
int X_MIN = 100;  int X_MAX = 900;   // raw values at the two short edges of the screen
int Y_MIN = 150;  int Y_MAX = 870;   // raw values at the two long edges
const float WIDTH  = 154.0;           // size of the touch area, in mm
const float HEIGHT = 86.0;

// ----- Your measurements (step 6) -----
float ARM  = 25.0;   // from the servo shaft to the elbow hole, in mm
float LINK = 70.0;   // from the elbow hole to the centre of the ball joint, in mm

// ----- Lili's settings -----
int   DIRECTION = 1;            // set to -1 if the arms go down when they should go up
int   DIRECTION_X = 1;          // set to -1 if the ball runs away along the length
int   DIRECTION_Y = 1;          // set to -1 if the ball runs away along the width
int   TRIM[3] = {0, 0, 0};      // small corrections so the plate is perfectly flat
float Kp = 0.12;   // P: Push      (degrees of tilt per mm away)
float Ki = 0.02;   // I: Insist
float Kd = 0.05;   // D: Dampen
const float MAX_TILT = 10.0;    // the plate never tilts more than 10 degrees
bool  CIRCLE = false;           // true = the ball goes round in a circle!

// ----- The robot's geometry (don't change it, it matches the 3D parts) -----
const float R_SERVO = 55.0;     // distance from the centre to the servo shafts
const float R_JOINT = 80.0;     // distance from the centre to the ball joints under the plate
const float LEG_ANGLE[3] = {0, 120, 240};

Servo servo[3];
float x = 0, y = 0;             // where the ball is (mm, 0 = in the middle)
float xBefore = 0, yBefore = 0;
float vx = 0, vy = 0;           // its speed (mm per second)
float sumX = 0, sumY = 0;
float restHeight;               // height of the ball joints when the plate is flat
unsigned long timeBefore = 0;
int   missing = 0;              // how many turns since the screen last felt the ball

// Reads the screen. Returns true if the ball is on it, and puts its position in x and y.
bool readBall(float &bx, float &by) {
  // 1. Is anything pressing on it?
  pinMode(YP, INPUT); pinMode(XM, INPUT);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  pinMode(XP, INPUT_PULLUP);
  delayMicroseconds(200);
  bool pressed = (digitalRead(XP) == LOW);
  pinMode(XP, INPUT); pinMode(YM, INPUT);
  if (!pressed) return false;

  // 2. Measure X: current flows from X+ to X-, we listen on Y+
  pinMode(XP, OUTPUT); digitalWrite(XP, HIGH);
  pinMode(XM, OUTPUT); digitalWrite(XM, LOW);
  delayMicroseconds(200);
  int rawX = (analogRead(YP) + analogRead(YP)) / 2;
  pinMode(XP, INPUT); pinMode(XM, INPUT);

  // 3. Measure Y: current flows from Y+ to Y-, we listen on X-
  pinMode(YP, OUTPUT); digitalWrite(YP, HIGH);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  delayMicroseconds(200);
  int rawY = (analogRead(XM) + analogRead(XM)) / 2;
  pinMode(YP, INPUT); pinMode(YM, INPUT);

  // 4. Turn the raw values into millimetres
  bx = (rawX - X_MIN) * WIDTH / (X_MAX - X_MIN) - WIDTH / 2;
  by = (rawY - Y_MIN) * HEIGHT / (Y_MAX - Y_MIN) - HEIGHT / 2;
  return true;
}

// Height of a ball joint -> angle of the arm (the triangle trick: arm, link, and the distance between them).
float armAngle(float height) {
  float dx = R_JOINT - R_SERVO;                  // horizontal gap between shaft and ball joint
  float d  = sqrt(dx * dx + height * height);    // distance shaft -> ball joint
  float c  = (ARM * ARM + d * d - LINK * LINK) / (2 * ARM * d);
  c = constrain(c, -1.0, 1.0);
  return degrees(atan2(height, dx) - acos(c));   // 0 = arm horizontal
}

// Tilts the plate: tiltX and tiltY in degrees.
void tilt(float tiltX, float tiltY) {
  for (int i = 0; i < 3; i++) {
    float a  = radians(LEG_ANGLE[i]);
    float rx = R_JOINT * cos(a);
    float ry = R_JOINT * sin(a);
    // how far this ball joint must go up or down
    float dz = rx * tan(radians(tiltX)) + ry * tan(radians(tiltY));
    float angle = armAngle(restHeight + dz);
    servo[i].writeMicroseconds(1500 + DIRECTION * angle * 11.1 + TRIM[i]);
  }
}

void setup() {
  Serial.begin(115200);
  float dx = R_JOINT - R_SERVO - ARM;
  restHeight = sqrt(LINK * LINK - dx * dx);
  for (int i = 0; i < 3; i++) servo[i].attach(PIN_SERVO[i]);
  tilt(0, 0);                    // start nice and flat
  delay(1000);
  timeBefore = millis();
}

void loop() {
  unsigned long now = millis();
  if (now - timeBefore < 20) return;            // 50 times a second
  float dt = (now - timeBefore) / 1000.0;
  timeBefore = now;

  // 1. The eyes look
  float nx, ny;
  if (!readBall(nx, ny)) {
    missing++;
    if (missing > 10) {                          // no more ball: go back to flat
      tilt(0, 0);
      sumX = sumY = 0; vx = vy = 0;
    }
    return;
  }
  if (missing > 10) { x = xBefore = nx; y = yBefore = ny; }  // the ball is back: start again from zero
  missing = 0;
  x = 0.6 * x + 0.4 * nx;                        // smooth out jumpy readings
  y = 0.6 * y + 0.4 * ny;

  // 2. The brain calculates
  float targetX = 0, targetY = 0;
  if (CIRCLE) {                                  // the target goes round the plate
    float t = now / 1000.0;
    targetX = 35 * cos(t * 1.5);
    targetY = 20 * sin(t * 1.5);
  }
  vx = 0.7 * vx + 0.3 * (x - xBefore) / dt;
  vy = 0.7 * vy + 0.3 * (y - yBefore) / dt;
  xBefore = x; yBefore = y;
  float ex = x - targetX, ey = y - targetY;
  sumX = constrain(sumX + ex * dt, -100, 100);
  sumY = constrain(sumY + ey * dt, -100, 100);

  float tiltX = DIRECTION_X * (Kp * ex + Ki * sumX + Kd * vx);
  float tiltY = DIRECTION_Y * (Kp * ey + Ki * sumY + Kd * vy);
  tiltX = constrain(tiltX, -MAX_TILT, MAX_TILT);
  tiltY = constrain(tiltY, -MAX_TILT, MAX_TILT);

  // 3. The muscles move
  tilt(tiltX, tiltY);

  // For the Serial Plotter: the ball and the target
  Serial.print(x); Serial.print(" "); Serial.print(y); Serial.print(" ");
  Serial.print(targetX); Serial.print(" "); Serial.println(targetY);
}
