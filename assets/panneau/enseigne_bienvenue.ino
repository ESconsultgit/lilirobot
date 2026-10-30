// ===========================================================
//  L'Enseigne lumineuse V2 · Le panneau défilant
//  Quand quelqu'un arrive, le panneau se réveille et dit bonjour !
// ===========================================================
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

// ----- Les branchements -----
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // lettres mélangées ? essaie GENERIC_HW
const int NB_MODULES   = 4;   // un panneau « 4 en 1 » = 4 carrés de 8 × 8
const int PIN_CS       = 10;  // DIN va sur D11 et CLK sur D13
const int PIN_PRESENCE = 2;   // la patte OUT du détecteur

// ----- Tes messages -----
const char *BIENVENUE = "Bonjour ! Bienvenue chez Ellie";
const char *MESSAGES[] = {
  "Bonne journée !",
  "À bientôt !"
};
const int NB_MESSAGES = 2;   // combien de messages il y a au-dessus

// ----- Les réglages d'Ellie -----
int  VITESSE      = 40;     // plus petit = plus rapide
int  LUMIERE      = 4;      // de 0 (doux) à 15 (très fort)
long RESTE_ALLUME = 20;     // secondes allumé après le dernier passage
bool TOUJOURS_ALLUME = false;  // true = ne s'éteint jamais

MD_Parola panneau = MD_Parola(HARDWARE_TYPE, PIN_CS, NB_MODULES);
char texte[160];                 // le message en train de défiler
int  numero = 0;                 // 0 = la bienvenue, puis les autres messages
bool allume = false;
unsigned long dernierPassage = 0;

// Le panneau connaît les lettres avec accents, mais il faut les « traduire » pour lui.
void preparer(const char *source) {
  int j = 0;
  for (int i = 0; source[i] != 0 && j < (int)sizeof(texte) - 1; i++) {
    unsigned char c = source[i];
    if (c < 0x80) texte[j++] = c;                                   // lettre normale
    else if (c == 0xC3 && source[i + 1]) texte[j++] = (unsigned char)source[++i] + 0x40;  // é, è, à, ç…
    else if (c == 0xC2 && source[i + 1]) texte[j++] = source[++i];         // °, «, »…
  }                                                                  // le reste (émojis) est ignoré
  texte[j] = 0;
}

// Lance le message suivant : d'abord la bienvenue, puis les autres, chacun son tour.
void messageSuivant() {
  if (numero == 0) preparer(BIENVENUE);
  else preparer(MESSAGES[numero - 1]);
  numero = (numero + 1) % (NB_MESSAGES + 1);
  panneau.displayText(texte, PA_CENTER, VITESSE, 0, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void reveiller() {
  allume = true;
  numero = 0;                    // on commence toujours par dire bonjour
  panneau.displayShutdown(false);
  messageSuivant();
}

void endormir() {
  allume = false;
  panneau.displayClear();
  panneau.displayShutdown(true); // le panneau s'éteint complètement
}

void setup() {
  pinMode(PIN_PRESENCE, INPUT);
  panneau.begin();
  panneau.setIntensity(LUMIERE);
  if (TOUJOURS_ALLUME) reveiller();
  else endormir();
}

void loop() {
  // 1. Les yeux : quelqu'un passe devant ?
  bool quelquun = (digitalRead(PIN_PRESENCE) == HIGH);
  if (quelquun) dernierPassage = millis();

  // 2. Le cerveau décide
  if (quelquun && !allume) reveiller();          // bonjour !

  // 3. Le panneau fait défiler. displayAnimate() dit « fini » à la fin d'un message.
  if (allume && panneau.displayAnimate()) {
    bool plusPersonne = (millis() - dernierPassage > RESTE_ALLUME * 1000UL);
    if (plusPersonne && !TOUJOURS_ALLUME) endormir();
    else messageSuivant();
  }
}
