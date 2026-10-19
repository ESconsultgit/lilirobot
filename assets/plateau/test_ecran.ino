// Test des yeux du plateau : l'écran tactile
// Les 4 fils de l'écran tactile, dans l'ordre : X+, Y+, X-, Y-
const int XP = A0;   // X+
const int YP = A1;   // Y+
const int XM = A2;   // X-
const int YM = A3;   // Y-

void setup() {
  Serial.begin(115200);
}

void loop() {
  // Est-ce que quelque chose appuie ?
  pinMode(YP, INPUT); pinMode(XM, INPUT);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  pinMode(XP, INPUT_PULLUP);
  delayMicroseconds(200);
  bool appui = (digitalRead(XP) == LOW);
  pinMode(XP, INPUT); pinMode(YM, INPUT);
  if (!appui) {
    Serial.println("Rien sur l'ecran");
    delay(200);
    return;
  }
  // Mesure X
  pinMode(XP, OUTPUT); digitalWrite(XP, HIGH);
  pinMode(XM, OUTPUT); digitalWrite(XM, LOW);
  delayMicroseconds(200);
  int brutX = analogRead(YP);
  pinMode(XP, INPUT); pinMode(XM, INPUT);
  // Mesure Y
  pinMode(YP, OUTPUT); digitalWrite(YP, HIGH);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  delayMicroseconds(200);
  int brutY = analogRead(XM);
  pinMode(YP, INPUT); pinMode(YM, INPUT);

  Serial.print("X = "); Serial.print(brutX);
  Serial.print("   Y = "); Serial.println(brutY);
  delay(200);
}
