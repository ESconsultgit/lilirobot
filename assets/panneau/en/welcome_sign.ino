// ===========================================================
//  The Light-up Sign V2 · The scrolling sign
//  When someone comes by, the sign wakes up and says hello!
// ===========================================================
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

// ----- The wiring -----
#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // jumbled letters? try GENERIC_HW
const int NUM_MODULES   = 4;   // a "4-in-1" panel = 4 squares of 8 × 8
const int PIN_CS        = 10;  // DIN goes to D11 and CLK to D13
const int PIN_PRESENCE  = 2;   // the sensor's OUT pin

// ----- Your messages -----
const char *WELCOME = "Hello! Welcome to Lili's";
const char *MESSAGES[] = {
  "Have a nice day!",
  "See you soon!"
};
const int NUM_MESSAGES = 2;   // how many messages there are above

// ----- Lili's settings -----
int  SPEED       = 40;     // smaller = faster
int  BRIGHTNESS  = 4;      // from 0 (soft) to 15 (very bright)
long STAY_ON     = 20;     // seconds it stays on after the last visitor
bool ALWAYS_ON   = false;  // true = never switches off

MD_Parola sign = MD_Parola(HARDWARE_TYPE, PIN_CS, NUM_MODULES);
char text[160];                  // the message that is scrolling
int  number = 0;                 // 0 = the welcome, then the other messages
bool on = false;
unsigned long lastVisit = 0;

// The sign knows accented letters, but they need "translating" for it.
void prepare(const char *source) {
  int j = 0;
  for (int i = 0; source[i] != 0 && j < (int)sizeof(text) - 1; i++) {
    unsigned char c = source[i];
    if (c < 0x80) text[j++] = c;                                    // normal letter
    else if (c == 0xC3 && source[i + 1]) text[j++] = (unsigned char)source[++i] + 0x40;   // é, è, à, ç…
    else if (c == 0xC2 && source[i + 1]) text[j++] = source[++i];          // °, «, »…
  }                                                                  // anything else (emojis) is skipped
  text[j] = 0;
}

// Starts the next message: the welcome first, then the others, one at a time.
void nextMessage() {
  if (number == 0) prepare(WELCOME);
  else prepare(MESSAGES[number - 1]);
  number = (number + 1) % (NUM_MESSAGES + 1);
  sign.displayText(text, PA_CENTER, SPEED, 0, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void wakeUp() {
  on = true;
  number = 0;                    // always start by saying hello
  sign.displayShutdown(false);
  nextMessage();
}

void goToSleep() {
  on = false;
  sign.displayClear();
  sign.displayShutdown(true);    // the sign switches off completely
}

void setup() {
  pinMode(PIN_PRESENCE, INPUT);
  sign.begin();
  sign.setIntensity(BRIGHTNESS);
  if (ALWAYS_ON) wakeUp();
  else goToSleep();
}

void loop() {
  // 1. The eyes: is someone walking by?
  bool someone = (digitalRead(PIN_PRESENCE) == HIGH);
  if (someone) lastVisit = millis();

  // 2. The brain decides
  if (someone && !on) wakeUp();                  // hello!

  // 3. The sign scrolls. displayAnimate() says "done" at the end of a message.
  if (on && sign.displayAnimate()) {
    bool nobodyLeft = (millis() - lastVisit > STAY_ON * 1000UL);
    if (nobodyLeft && !ALWAYS_ON) goToSleep();
    else nextMessage();
  }
}
