// ===========================================================
//  L'Équilibriste 2 · Le plateau — le grand programme
//  Les yeux : l'écran tactile. Les muscles : 3 servomoteurs.
// ===========================================================
#include <Servo.h>

// ----- Les branchements -----
// Les 4 fils de l'écran tactile, dans l'ordre : X+, Y+, X-, Y-
const int XP = A0;   // X+
const int YP = A1;   // Y+
const int XM = A2;   // X-
const int YM = A3;   // Y-
// Les servomoteurs A, B, C (dans le sens inverse des aiguilles d'une montre, vus d'en haut)
const int PIN_SERVO[3] = {9, 10, 11};

// ----- Ta calibration (étape 8) -----
int X_MIN = 100;  int X_MAX = 900;   // valeurs brutes aux deux bords courts de l'écran
int Y_MIN = 150;  int Y_MAX = 870;   // valeurs brutes aux deux bords longs
const float LARGEUR = 154.0;          // taille de la zone tactile, en mm
const float HAUTEUR = 86.0;

// ----- Tes mesures (étape 6) -----
float BRAS      = 25.0;  // de l'axe du servo au trou du coude, en mm
float BIELLETTE = 70.0;  // du trou du coude au centre de la rotule, en mm

// ----- Les réglages de Lili -----
int   SENS = 1;                 // mets -1 si les bras descendent quand ils devraient monter
int   SENS_X = 1;               // mets -1 si la balle s'enfuit sur la longueur
int   SENS_Y = 1;               // mets -1 si la balle s'enfuit sur la largeur
int   REGLAGE[3] = {0, 0, 0};   // petites corrections pour que le plateau soit bien à plat
float Kp = 0.12;   // P : Pousse     (degrés de pente par mm d'écart)
float Ki = 0.02;   // I : Insiste
float Kd = 0.05;   // D : Doucement
const float PENTE_MAX = 10.0;   // le plateau ne penche jamais plus de 10 degrés
bool  CERCLE = false;           // true = la balle tourne en rond !

// ----- La géométrie du robot (ne change pas, c'est celle des pièces 3D) -----
const float R_SERVO  = 55.0;    // distance du centre à l'axe des servos
const float R_ROTULE = 80.0;    // distance du centre aux rotules sous le plateau
const float ANGLE_JAMBE[3] = {0, 120, 240};

Servo servo[3];
float x = 0, y = 0;             // où est la balle (mm, 0 = au milieu)
float xAvant = 0, yAvant = 0;
float vx = 0, vy = 0;           // sa vitesse (mm par seconde)
float sommeX = 0, sommeY = 0;
float hauteurRepos;             // hauteur des rotules quand le plateau est à plat
unsigned long tempsAvant = 0;
int   absences = 0;             // depuis combien de tours l'écran ne sent plus la balle

// Lit l'écran. Rend true si la balle est posée, et met sa position dans x et y.
bool lireBalle(float &bx, float &by) {
  // 1. Y a-t-il quelque chose qui appuie ?
  pinMode(YP, INPUT); pinMode(XM, INPUT);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  pinMode(XP, INPUT_PULLUP);
  delayMicroseconds(200);
  bool appui = (digitalRead(XP) == LOW);
  pinMode(XP, INPUT); pinMode(YM, INPUT);
  if (!appui) return false;

  // 2. Mesure X : le courant passe de X+ à X-, on écoute sur Y+
  pinMode(XP, OUTPUT); digitalWrite(XP, HIGH);
  pinMode(XM, OUTPUT); digitalWrite(XM, LOW);
  delayMicroseconds(200);
  int brutX = (analogRead(YP) + analogRead(YP)) / 2;
  pinMode(XP, INPUT); pinMode(XM, INPUT);

  // 3. Mesure Y : le courant passe de Y+ à Y-, on écoute sur X-
  pinMode(YP, OUTPUT); digitalWrite(YP, HIGH);
  pinMode(YM, OUTPUT); digitalWrite(YM, LOW);
  delayMicroseconds(200);
  int brutY = (analogRead(XM) + analogRead(XM)) / 2;
  pinMode(YP, INPUT); pinMode(YM, INPUT);

  // 4. On transforme les valeurs brutes en millimètres
  bx = (brutX - X_MIN) * LARGEUR / (X_MAX - X_MIN) - LARGEUR / 2;
  by = (brutY - Y_MIN) * HAUTEUR / (Y_MAX - Y_MIN) - HAUTEUR / 2;
  return true;
}

// La hauteur d'une rotule -> l'angle du bras (le calcul du triangle : bras, biellette, et la distance entre les deux).
float angleBras(float hauteur) {
  float dx = R_ROTULE - R_SERVO;                 // écart horizontal entre l'axe et la rotule
  float d  = sqrt(dx * dx + hauteur * hauteur);  // distance axe -> rotule
  float c  = (BRAS * BRAS + d * d - BIELLETTE * BIELLETTE) / (2 * BRAS * d);
  c = constrain(c, -1.0, 1.0);
  return degrees(atan2(hauteur, dx) - acos(c)); // 0 = bras à l'horizontale
}

// Penche le plateau : penteX et penteY en degrés.
void pencher(float penteX, float penteY) {
  for (int i = 0; i < 3; i++) {
    float a  = radians(ANGLE_JAMBE[i]);
    float rx = R_ROTULE * cos(a);
    float ry = R_ROTULE * sin(a);
    // de combien cette rotule doit monter ou descendre
    float dz = rx * tan(radians(penteX)) + ry * tan(radians(penteY));
    float angle = angleBras(hauteurRepos + dz);
    servo[i].writeMicroseconds(1500 + SENS * angle * 11.1 + REGLAGE[i]);
  }
}

void setup() {
  Serial.begin(115200);
  float dx = R_ROTULE - R_SERVO - BRAS;
  hauteurRepos = sqrt(BIELLETTE * BIELLETTE - dx * dx);
  for (int i = 0; i < 3; i++) servo[i].attach(PIN_SERVO[i]);
  pencher(0, 0);                 // on commence bien à plat
  delay(1000);
  tempsAvant = millis();
}

void loop() {
  unsigned long maintenant = millis();
  if (maintenant - tempsAvant < 20) return;     // 50 fois par seconde
  float dt = (maintenant - tempsAvant) / 1000.0;
  tempsAvant = maintenant;

  // 1. Les yeux regardent
  float nx, ny;
  if (!lireBalle(nx, ny)) {
    absences++;
    if (absences > 10) {                         // plus de balle : on se remet à plat
      pencher(0, 0);
      sommeX = sommeY = 0; vx = vy = 0;
    }
    return;
  }
  if (absences > 10) { x = xAvant = nx; y = yAvant = ny; }  // la balle revient : on repart de zéro
  absences = 0;
  x = 0.6 * x + 0.4 * nx;                       // on adoucit les mesures qui sautillent
  y = 0.6 * y + 0.4 * ny;

  // 2. Le cerveau calcule
  float cibleX = 0, cibleY = 0;
  if (CERCLE) {                                  // la cible fait le tour du plateau
    float t = maintenant / 1000.0;
    cibleX = 35 * cos(t * 1.5);
    cibleY = 20 * sin(t * 1.5);
  }
  vx = 0.7 * vx + 0.3 * (x - xAvant) / dt;
  vy = 0.7 * vy + 0.3 * (y - yAvant) / dt;
  xAvant = x; yAvant = y;
  float ex = x - cibleX, ey = y - cibleY;
  sommeX = constrain(sommeX + ex * dt, -100, 100);
  sommeY = constrain(sommeY + ey * dt, -100, 100);

  float penteX = SENS_X * (Kp * ex + Ki * sommeX + Kd * vx);
  float penteY = SENS_Y * (Kp * ey + Ki * sommeY + Kd * vy);
  penteX = constrain(penteX, -PENTE_MAX, PENTE_MAX);
  penteY = constrain(penteY, -PENTE_MAX, PENTE_MAX);

  // 3. Les muscles bougent
  pencher(penteX, penteY);

  // Pour le Traceur série : la balle et la cible
  Serial.print(x); Serial.print(" "); Serial.print(y); Serial.print(" ");
  Serial.print(cibleX); Serial.print(" "); Serial.println(cibleY);
}
