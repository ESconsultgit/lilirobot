// Test : est-ce que le panneau LED marche ?
#include <MD_Parola.h>
#include <MD_MAX72xx.h>
#include <SPI.h>

#define HARDWARE_TYPE MD_MAX72XX::FC16_HW  // lettres mélangées ? essaie GENERIC_HW
MD_Parola panneau = MD_Parola(HARDWARE_TYPE, 10, 4);   // CS sur D10, 4 modules

void setup() {
  panneau.begin();
  panneau.setIntensity(2);       // lumière douce pour le test
  panneau.displayText("Coucou !", PA_CENTER, 50, 1000, PA_SCROLL_LEFT, PA_SCROLL_LEFT);
}

void loop() {
  if (panneau.displayAnimate()) panneau.displayReset();   // on recommence, sans fin
}
