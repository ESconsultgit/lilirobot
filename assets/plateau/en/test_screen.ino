// Testing the plate's eyes: the touchscreen
// The 4 touchscreen wires, in order: X+, Y+, X-, Y-
const int XP = A0;   // X+
const int YP = A1;   // Y+
const int XM = A2;   // X-
const int YM = A3;   // Y-

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Is anything pressing on it?
  pinMode(YP, INPUT); pinMode(XM, INPUT);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  pinMode(XP, INPUT_PULLUP);
  delayMicroseconds(200);
  bool pressed = (digitalRead(XP) == LOW);
  pinMode(XP, INPUT); pinMode(YM, INPUT);
  if (!pressed) {
    Serial.println("Nothing on the screen");
    delay(200);
    return;
  }
  // Measure X
  pinMode(XP, OUTPUT); digitalWrite(XP, HIGH);
  pinMode(XM, OUTPUT); digitalWrite(XM, LOW);
  delayMicroseconds(200);
  int rawX = analogRead(YP);
  pinMode(XP, INPUT); pinMode(XM, INPUT);
  // Measure Y
  pinMode(YP, OUTPUT); digitalWrite(YP, HIGH);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  delayMicroseconds(200);
  int rawY = analogRead(XM);
  pinMode(YP, INPUT); pinMode(YM, INPUT);

  Serial.print("X = "); Serial.print(rawX);
  Serial.print("   Y = "); Serial.println(rawY);
  delay(200);
}
