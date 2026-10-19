// Test: does the LED sign work?
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // jumbled letters? try GENERIC_HW
MD_Parola sign = MD_Parola(HARDWARE_TYPE, 10, 4);   // CS on D10, 4 modules

void setup() {
  sign.begin();
  sign.setIntensity(2);          // soft light for the test
  sign.displayText("Hello!", PA_CENTER, 50, 1000, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void loop() {
  if (sign.displayAnimate()) sign.displayReset();   // start again, forever
}
