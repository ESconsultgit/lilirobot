# 🎨 Les Gardiens de Lili — prompts Gemini

Prompts pour générer les images du jeu avec Gemini (Nano Banana). Ils sont **en anglais** : le modèle suit un peu plus fidèlement les consignes techniques (fond uni, cadrage, « no text ») en anglais. Les noms des personnages restent en français.

## Avancement

- ✅ Étape 1 — planche de style (`sources/planche-de-style.jpg`)
- ✅ Étape 2 — princesse Lili
- ✅ Étape 3 — château
- Étape 4 — gardiens : ✅ Braisou, ✅ Gouttine, ✅ Feuillou, ✅ Zapic, ✅ Givrou, ✅ Plumo, ✅ Rocaillou, ✅ Étoilette, ✅ Lunette, ✅ Sousou
- ✅ Étape 5 — Chipeurs
- ✅ Étape 6 — grands boss
- ✅ Étape 7 — fonds de maps
- ✅ Étape 8 — icône
- ✅ Monde 4 : fond du Marais, Reine Grenouille, Gloupi (les images guides des maps ont été refaites le 24/11 : utiliser les versions actuelles)

## Méthode

1. **Une seule conversation Gemini par étape**, dans l'ordre ci-dessous. On commence par la **planche de style** et on la refait jusqu'à ce qu'elle plaise : c'est elle qui fixe le style de tout le reste.
2. **Joindre la planche de style validée** à chaque prompt suivant (bouton ➕ → importer), et dire à quoi elle sert (« Image 1 = style reference »). C'est déjà écrit dans les prompts.
3. **Une image par demande.** Si un détail cloche, demander une **retouche ciblée** dans la même conversation (« Keep everything identical, only change … ») plutôt que de tout regénérer.
4. **Les 3 formes d'un gardien dans une seule image** (côte à côte) : c'est le meilleur moyen pour que le bébé, le grand et le super se ressemblent. Je découpe ensuite.
5. **Fond vert uni** (#00FF00) pour tous les personnages (magenta #FF00FF pour les personnages verts) : Gemini ne sait pas faire de vrai fond transparent, je retire le fond moi-même. S'il dessine un damier gris et blanc à la place, redemander « solid flat #00FF00 background, not transparent, no checkerboard ».
6. **Télécharger en pleine résolution** (PNG), et me les envoyer telles quelles : je m'occupe du découpage, du détourage et de la conversion en `.webp`.
7. Ne pas écrire « Pokémon » dans les prompts : on décrit les créatures, pour qu'elles restent originales.

Images jointes à utiliser (dans `gardiens/gemini/`) : `ref-lili-coucou.png` (Ellie), `ref-livia-idee.png` (Livia), `ref-duo-equipe.png`, `guide-map-1.png`, `guide-map-2.png`, `guide-map-3.png`.

## Bloc de style commun

Déjà inclus dans chaque prompt. Si une image dérive, on peut le recoller tel quel :

```
STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines of medium thickness, simple cel shading (one soft shadow tone and one highlight), bright saturated cheerful colours. Friendly and never scary. No text, no letters, no watermark, no signature, no frame.
```

---

## Étape 1 — Planche de style

Format 16:9. Rien à joindre.

```
Create a character style sheet for a cute children's tower defense game called "Les Gardiens de Lili".

STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines of medium thickness, simple cel shading (one soft shadow tone and one highlight), bright saturated cheerful colours. Friendly and never scary. No text, no letters, no watermark, no signature, no frame.

Show these 5 characters standing in one row, full body, same scale, evenly spaced, on a plain solid light cream background:
1. Princess Lili: a cheerful girl about 8 years old, long wavy chestnut hair, a pink and lavender princess ball gown with puffy sleeves, a small golden tiara with a pink heart gem.
2. Braisou (baby form): a small round fire creature the size of a kitten, warm orange-red fur, a little candle-like flame tuft on top of its head, tiny paws, a happy smile.
3. Gouttine (baby form): a small baby otter made of shiny blue water, drop-shaped body, tiny fins, bubbles around it.
4. Feuillou (baby form): a small baby hedgehog whose spines are soft green leaves, a little flower bud on its head.
5. A Chipeur (villain minion): a small chubby purple imp with pointy ears, a black bandit eye mask, a mischievous grin, carrying a small loot sack. Silly rather than scary.

Wide 16:9 image.
```

## Étape 2 — Princesse Lili (3 expressions)

Joindre : la planche de style validée.

```
Image 1 is the style reference: keep exactly the same art style and the same Princess Lili design (face, chestnut hair, pink and lavender gown, golden tiara with a pink heart gem).

Draw Princess Lili three times side by side, full body, same size, evenly spaced with a clear gap between them:
1. happy and smiling, waving,
2. worried, hands on her cheeks,
3. victorious, jumping with joy, arms raised.

Background: perfectly flat solid pure green #00FF00 (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, clean dark outlines, simple cel shading, bright colours. No text. Wide 16:9 image.
```

## Étape 3 — Le château de Lili

Joindre : la planche de style (image 1), `ref-lili-coucou.png` (image 2), `ref-livia-idee.png` (image 3).

```
Image 1 is the style reference (art style and Princess Lili's design). Image 2 is Ellie, a small green robot girl. Image 3 is Livia, a small pink robot girl. Keep Ellie and Livia exactly as they look in their images.

Draw Princess Lili's fairy-tale castle, seen from a 3/4 top-down game view (as in a tower defense game), facing left: pastel pink stone walls, lavender-purple pointed tower roofs with little pink flags, a big wooden gate on the LEFT side of the castle where the enemies try to come in. Princess Lili stands on a central balcony; Ellie and Livia stand on the wall on each side of her, looking proud, as if they organised the castle's defence.
Compact castle that fills most of the image, nothing cut off.

Background: perfectly flat solid pure blue #0000FF (chroma key), no gradient, no ground, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, clean dark outlines, simple cel shading, bright colours. No text. Square 1:1 image.
```

## Étape 4 — Les 10 gardiens (une image par gardien, 3 formes)

Joindre à chaque fois : la planche de style. Pour Braisou, Gouttine et Feuillou, la forme bébé est déjà sur la planche : il faut la reprendre à l'identique.

**Gabarit** (remplacer `[NOM]`, `[FOND]` et les 3 descriptions) :

```
Image 1 is the style reference: keep exactly the same art style.

Draw [NOM], a guardian creature, in its 3 evolution stages, side by side from left to right, all facing the viewer in a 3/4 front view, full body, evenly spaced with a clear gap between them. Each stage is bigger and more impressive than the previous one, but clearly the same creature (same colours, same face, same key features):
1. Baby: [BÉBÉ]
2. Grand (teen): [GRAND]
3. Super (final): [SUPER]
Sizes: the baby is about half the height of the super form.

Background: perfectly flat solid [FOND] (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines, simple cel shading, bright saturated colours. Friendly, never scary. Simple, readable silhouette that is still recognisable when very small. No text. Wide 16:9 image.
```

| Gardien | [FOND] | Bébé | Grand | Super |
|---|---|---|---|---|
| 🔥 **Braisou** (feu) | pure green #00FF00 | exactly the baby Braisou from image 1: small round orange-red fire creature with a candle-like flame tuft on its head | a bigger, bouncy fire creature with a flaming mane and a small flame at the tip of its tail | a proud, majestic fire creature with a big glowing flame mane like a crown, glowing ember chest |
| 💧 **Gouttine** (eau) | pure green #00FF00 | exactly the baby Gouttine from image 1: baby otter made of shiny blue water, drop-shaped body | a playful water otter with a swirling water tail and a ring of bubbles | a graceful water otter with a flowing water scarf, a small seashell crown and sparkling droplets |
| 🌿 **Feuillou** (plante) | pure magenta #FF00FF | exactly the baby Feuillou from image 1: baby hedgehog with soft green leaves as spines and a flower bud | a hedgehog with a bushy leaf mane and a curly vine tail, the bud has bloomed into a flower | a wise forest hedgehog wearing a crown of leaves and pink flowers, vines swirling around it |
| ⚡ **Zapic** (électricité) | pure green #00FF00 | a round fluffy yellow chick with a zig-zag lightning crest | a bigger yellow bird with zig-zag wing tips and tiny sparks | a majestic thunder bird with glowing electric feathers and a lightning-bolt tail |
| ❄️ **Givrou** (glace) | pure green #00FF00 | a fluffy white and icy-blue baby bunny with snowflake tips on its ears | a bunny with frosty crystal ears and a fluffy snowball tail | an elegant ice rabbit with a sparkling ice-crystal crown and a cape of snowflakes |
| 🌬️ **Plumo** (vent) | pure green #00FF00 | a tiny round owl chick that looks like a soft white cloud puff | a pale blue owl with swirling wind-shaped feathers | a majestic sky owl with large spread wings and swirling wind ribbons around it |
| 🪨 **Rocaillou** (roche) | pure green #00FF00 | a small baby turtle with a round grey-brown pebble shell | a sturdy turtle whose shell has rocks and small amethyst crystals | a big strong turtle with a little mountain on its shell, crystals glowing |
| ⭐ **Étoilette** (étoile) | pure green #00FF00 | a tiny pink kitten with a star-shaped tail tip and sparkles | a pink star kitten with a little star on its forehead and sparkly fur | a magical star cat with tiny sparkling wings and a comet tail full of stars |
| 🌙 **Lunette** (lune) | pure green #00FF00 | a small night-blue fawn (baby deer) with tiny crescent-moon antlers | a slender night-blue deer with silver crescent antlers and star spots | a majestic moon deer with large glowing crescent antlers and a starry mane |
| 🪙 **Sousou** (pièce) | pure green #00FF00 | a tiny golden piggy-bank creature with a coin slot on its back | a bigger shiny golden piggy bank with coins orbiting around it | a royal golden piggy bank with a small crown and a cascade of coins |

## Étape 5 — Les Chipeurs

Joindre : la planche de style.

```
Image 1 is the style reference: keep exactly the same art style and the same Chipeur design (small chubby purple imp, pointy ears, black bandit eye mask, loot sack).

Draw 7 villain minions in one row, all walking towards the RIGHT, seen from the side (profile), full body, evenly spaced with a clear gap between them. They are silly and mischievous, never scary:
1. Chipeur: exactly the Chipeur from image 1.
2. Fusée: a small skinny red Chipeur running very fast, with a tiny rocket strapped on its back.
3. Costaud: a big, round, chubby brown Chipeur, slow and strong.
4. Casqué: a grey-blue Chipeur wearing a big metal cooking-pot helmet.
5. Volant: a dark violet Chipeur flying with little bat wings.
6. Fantôme: a pale, semi-transparent ghost-like Chipeur under a white sheet, giggling.
7. Chef des Chipeurs: a bigger magenta Chipeur with a wonky golden crown, a red cape and a big loot sack (mini-boss).

Background: perfectly flat solid pure green #00FF00 (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, clean dark outlines, simple cel shading, bright colours. No text. Wide 16:9 image.
```

## Étape 6 — Les 3 grands boss (une image chacun)

Joindre : la planche de style. Fond vert pur pour les trois.

```
Image 1 is the style reference: keep exactly the same art style.

Draw [BOSS], the final boss of a cute children's tower defense game, walking towards the RIGHT, seen from the side, full body, big and impressive but funny rather than scary: [DESCRIPTION]

Background: perfectly flat solid pure green #00FF00 (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, clean dark outlines, simple cel shading, bright colours. No text. Square 1:1 image.
```

| [BOSS] | [DESCRIPTION] |
|---|---|
| La Grosse Taupe Grognon | a giant grumpy brown mole with a miner's helmet and lamp, big digging claws, a bandit mask like the Chipeurs, and a huge loot sack |
| Le Yéti Ronchon | a giant grumpy white-and-icy-blue yeti with a frosty beard, a bandit mask like the Chipeurs, holding a big snowball |
| Le Dragon de Grognon | a big chubby grumpy red dragon with small wings, puffs of smoke from its nostrils, a bandit mask like the Chipeurs |

## Étape 7 — Les 3 fonds de maps

Joindre : la planche de style (image 1) et l'image guide du monde (image 2). Le chemin doit rester **exactement** au même endroit : c'est lui que suivent les méchants. S'il bouge, je recale le tracé dans le code, mais c'est plus simple s'il ne bouge pas.

```
Image 1 is the style reference: keep the same art style. Image 2 is a layout guide: the light band is the enemies' path and the magenta rectangle is where the castle will be placed later.

Redraw image 2 as a beautiful top-down game map for a cute children's tower defense game: [THÈME].
Keep the path EXACTLY the same shape, width and position as in image 2, as a [CHEMIN], clear of any object. Leave the magenta rectangle area as plain empty ground (no castle, no objects, no magenta). Decorations only on the sides of the path, with plenty of open ground next to the path where guardians will be placed. No characters, no creatures, no buildings, no text.
STYLE: cute 2D cartoon illustration, top-down view, clean outlines, soft cel shading, bright cheerful colours. Same 16:9 format as image 2.
```

| Monde | Image guide | [THÈME] | [CHEMIN] |
|---|---|---|---|
| 🌸 La Prairie fleurie | `guide-map-1.png` | a sunny flowery meadow with soft green grass, colourful flowers, round bushes, a few trees and a little stream with a small wooden bridge far from the path | light sandy dirt path with small pebbles |
| ❄️ La Forêt enneigée | `guide-map-2.png` | a snowy pine forest with snow-covered fir trees, snowdrifts, a small frozen pond and sparkling snow | trodden snowy path, light blue-grey |
| 🌋 Le Volcan | `guide-map-3.png` | a friendly cartoon volcano land with dark brown rocks, small glowing lava pools, purple crystals and a smoking volcano in a corner far from the path | warm brown rocky path |

## Étape 8 — Icône de l'application

Joindre : la planche de style et l'image du château validée.

```
Image 1 is the style reference and image 2 is Princess Lili's castle. Create a square app icon for the game: Princess Lili smiling in front of her castle, Braisou, Gouttine and Feuillou (baby forms) at her feet, bright pink-to-violet gradient sky background. Simple, bold, readable at small size, centered subject with some margin around it. No text. Square 1:1 image.
```

## Plus tard — vidéo de lancement

Une fois toutes les images validées et assemblées dans le jeu, on préparera le prompt de la vidéo de lancement à partir des images finales.

## Vidéo de lancement

Faite avec **Gemini Omni** dans l'app Gemini (bouton vidéo), en **3 plans de 10 secondes** enchaînés dans la même conversation avec « prolonger la scène ». Joindre au premier plan les 5 images de référence de `gardiens/gemini/video/` : `ref-1-princesse.png`, `ref-2-chateau.png`, `ref-3-gardiens.png`, `ref-4-mechants.png`, `ref-5-prairie.png`. Pas de texte dans la vidéo : le titre « Les Gardiens de Lili » s'ajoute ensuite par-dessus.

### Plan 1 — Le château en danger

```
Use the 5 attached images as references and keep every character exactly as drawn there: Image 1 is Princess Lili, Image 2 is her pink castle (with Ellie, the small green robot girl, and Livia, the small pink robot girl, on the walls), Image 3 shows the ten cute guardian creatures, Image 4 shows the villains (the purple masked Chipeurs, their crowned chief and three big bosses), Image 5 is the sunny meadow map with its winding sandy path.

Opening shot of a launch trailer for a cute children's tower defense game. 2D cartoon animation, bright and cheerful, exactly in the art style of the references.
The camera glides over the sunny flowery meadow from Image 5 and follows the winding sandy path up to Princess Lili's pink castle. Princess Lili waves happily from her balcony, Ellie and Livia wave next to her. Suddenly, at the far end of the path, a group of mischievous purple Chipeurs from Image 4 sneaks in, giggling, carrying loot sacks. Princess Lili looks worried and puts her hands on her cheeks. Ellie points at the Chipeurs.
Sound: cheerful orchestral adventure music for kids, birds singing, then playful sneaky pizzicato when the Chipeurs appear. No dialogue. No text on screen.
```

### Plan 2 — Les gardiens entrent en jeu

Dans la même conversation, demander de prolonger la scène :

```
Continue the scene. Ellie and Livia throw little glowing stars that land along the sides of the path, and with a sparkle each star turns into a guardian from Image 3: Braisou the fire fox shoots fireballs, Gouttine the water otter sprays water jets, Zapic the yellow chick sends lightning bolts that jump between Chipeurs, Givrou the ice bunny throws snowflakes that slow them down, Rocaillou the rock turtle throws a big rock. Each Chipeur that gets hit bursts into a puff of little golden stars and runs away home, comically. Braisou glows and evolves into a bigger, prouder fire creature in a flash of light. Same art style, same characters, fast and fun, nothing scary or violent.
Sound: the music becomes energetic and heroic, with magical sparkles, whooshes, cute pops and kids cheering. No dialogue. No text on screen.
```

### Plan 3 — Le grand boss et la victoire

Prolonger encore la scène :

```
Continue the scene. The ground shakes: the giant grumpy mole boss from Image 4, with his miner's helmet and huge loot sack, stomps along the path towards the castle. All the guardians line up together and attack at the same time in a colourful burst of fire, water, lightning, snow and stars. The mole boss gets dizzy, drops his sack and runs away, crying comically. Princess Lili jumps with joy on her balcony with Ellie and Livia, the guardians cheer around the castle. The camera slowly pulls back up into the sky above the castle at sunset, leaving the top of the sky empty for a title.
Sound: big triumphant finale of the music, cheering, fireworks. No dialogue. No text on screen.
```

## Monde 4 — Le Marais enchanté (deux chemins)

### Fond de map

Joindre : la planche de style (image 1) et `guide-map-4.png` (image 2). Le chemin se sépare en deux au milieu puis se rejoint avant le château : les deux branches doivent rester exactement à leur place.

```
Image 1 is the style reference: keep the same art style. Image 2 is a layout guide: the light band is the enemies' path, which splits into TWO separate paths in the middle and joins again before the castle; the magenta rectangle is where the castle will be placed later.

Redraw image 2 as a beautiful top-down game map for a cute children's tower defense game: a magical enchanted swamp with dark green-blue water pools, giant lily pads, reeds and cattails, glowing mushrooms, fireflies, small wooden boardwalks and twisted friendly trees, a bit misty but cheerful.
Keep BOTH paths EXACTLY the same shape, width and position as in image 2, as a light muddy path with small stones, clear of any object; keep the split and the junction exactly where they are. Leave the magenta rectangle area as plain empty ground (no castle, no objects, no magenta). Decorations only beside the paths, with plenty of open ground next to the paths where guardians will be placed, including inside the two loops. No characters, no creatures, no buildings, no text.
STYLE: cute 2D cartoon illustration, top-down view, clean outlines, soft cel shading, bright cheerful colours. Same 16:9 format as image 2.
```

### Grand boss du monde 4

Joindre : la planche de style.

```
Image 1 is the style reference: keep exactly the same art style.

Draw La Reine Grenouille Grognon, the final boss of a cute children's tower defense game, walking towards the RIGHT, seen from the side, full body, big and impressive but funny rather than scary: a huge grumpy chubby green frog queen with a small wonky golden crown, a black bandit eye mask like the Chipeurs, a lily-pad cape and a big loot sack.

Background: perfectly flat solid pure magenta #FF00FF (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, clean dark outlines, simple cel shading, bright colours. No text. Square 1:1 image.
```

## Nouveau gardien — Gloupi (poison)

Joindre : la planche de style.

```
Image 1 is the style reference: keep exactly the same art style.

Draw Gloupi, a guardian creature, in its 3 evolution stages, side by side from left to right, all facing the viewer in a 3/4 front view, full body, evenly spaced with a clear gap between them. Each stage is bigger and more impressive than the previous one, but clearly the same creature (same colours, same face, same key features):
1. Baby: a tiny round wobbly blob of translucent lime-green jelly with big shiny eyes, a happy smile and little purple poison bubbles floating inside it
2. Grand (teen): a bigger jelly creature with a wobbly drip on its head like a little crest, small jelly arms, more glowing purple bubbles inside and a few drips at its feet
3. Super (final): a majestic jelly creature with a crown-shaped drip on its head, a jelly cape, glowing green aura and purple bubbles swirling around it
Sizes: the baby is about half the height of the super form. Cute and friendly, never gross or scary.

Background: perfectly flat solid pure blue #0000FF (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard.
STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines, simple cel shading, bright saturated colours. Simple, readable silhouette that is still recognisable when very small. No text. Wide 16:9 image.
```

## Avatars des joueurs (16, une seule image)

Joindre : la planche de style. Fond vert à retirer, puis je découpe les 16 avatars.

```
Image 1 is the style reference: keep exactly the same art style.

Draw a sheet of 16 player avatars for a children's game, arranged in a neat grid of 4 rows and 4 columns, evenly spaced with a wide clear gap between them. Each avatar is a round badge: a head-and-shoulders portrait, facing the viewer, smiling, inside a soft pastel circle with a thick white border. All badges are exactly the same size. Each character must be instantly recognisable even when very small (48 pixels).
Row 1 (kids): a little princess with a tiara and long hair (pink circle); a little knight boy with a shiny helmet visor up (light blue circle); a little fairy girl with sparkly wings (lilac circle); a young wizard boy with a starry hat (dark blue circle)
Row 2 (kids): an astronaut kid in a round helmet (navy circle with tiny stars); a pirate kid with a bandana and eyepatch (sand yellow circle); a superhero kid with a mask and cape (red circle); a ninja kid with a headband (grey circle)
Row 3 (animals): a white unicorn with a rainbow mane (pink circle); a ginger kitten (peach circle); a happy puppy with floppy ears (light brown circle); a little fox (orange circle)
Row 4 (animals): a panda (mint circle); a bunny with long ears (lavender circle); a smiling frog (light green circle); a baby dragon, cute, not scary (turquoise circle)

Background around the badges: perfectly flat solid pure green #00FF00 (chroma key), no gradient, no shadow, not transparent, no checkerboard. Do not use that exact green inside the badges.
STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines, simple cel shading, bright saturated colours. No text, no letters. Square 1:1 image.
```

## Icônes des menus (16, une seule image)

Joindre : la planche de style. Fond magenta à retirer.

```
Image 1 is the style reference: keep exactly the same art style.

Draw a sheet of 16 game interface icons for a children's tower defense game, arranged in a neat grid of 4 rows and 4 columns, evenly spaced with a wide clear gap between them. Each icon is a single chunky object, front view, glossy and cute, with a thick dark outline, all the same size, easy to understand at 32 pixels. No faces on the objects, no buttons or frames around them.
Row 1: a big green "play" triangle (start the wave); two curved arrows forming a circle (automatic mode); a fast-forward double triangle with little speed lines (speed); a pause sign made of two rounded bars
Row 2: a blue and gold shield (the team of guardians); a purple gear (settings menu); a golden trophy cup with a star (ranking); a rolled-out treasure map with a dotted path and a little castle (the worlds)
Row 3: two little smiling silhouettes, one pink and one purple (change player); four corner arrows pointing outwards (full screen); a pink spyglass / telescope (look at the next wave); a pencil (edit name)
Row 4: a shiny golden coin with a heart engraved on it (LiliDollars money); a big glossy red heart (castle lives); a pink castle tower with a flag (the castle); a blue ocean wave (the wave counter)

Background: perfectly flat solid pure magenta #FF00FF (chroma key), no gradient, no shadow, not transparent, no checkerboard. Do not use magenta in the icons (use red or soft pink instead).
STYLE: cute 2D cartoon game icons, like a modern mobile game for kids. Soft rounded shapes, clean dark outlines, simple cel shading with a small white highlight, bright saturated colours. No text, no letters, no numbers. Square 1:1 image.
```

## Nouveau gardien — Prismi (se métamorphose)

Joindre : la planche de style. Une seule image avec les 5 formes. Fond magenta (pas de vert : une forme est verte).

```
Image 1 is the style reference: keep exactly the same art style.

Draw Prismi, a guardian creature that can transform with magic stones, in 5 different forms side by side from left to right, all facing the viewer in a 3/4 front view, full body, all the SAME size, evenly spaced with a clear gap between them. All 5 forms are clearly the same creature: same body shape (a small round fluffy creature, a mix of a kitten and a bunny, with long soft ears, a fluffy tail, big shiny eyes and a big faceted gem on its forehead), same face, same pose; only the colours, the gem and the elemental details change:
1. Normal form: soft cream and pale lilac fur, a clear rainbow-shimmering crystal gem on its forehead, tiny sparkles around it
2. Plant form: leaf-green fur, ears shaped like big leaves, a little flower crown, a vine curling around its tail, a green emerald gem
3. Ice form: icy light-blue and white fur, frosty crystal tips on its ears and tail, a snowflake-shaped ice gem, a few snowflakes around it
4. Fire form: warm orange-red fur, a flaming mane and a flame at the tip of its tail, a glowing ruby gem, little embers around it
5. Poison form: deep violet fur with lime-green spots, a wobbly drip of green jelly on its head, an amethyst gem, small green poison bubbles around it (use violet and lime green, no pink, no magenta)
Cute and friendly, never scary. Simple, readable silhouettes that stay recognisable when very small.

Background: perfectly flat solid pure magenta #FF00FF (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard. Do not use magenta or pink on the creature.
STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines, simple cel shading, bright saturated colours. No text. Wide 16:9 image.
```

### Les 4 pierres magiques

Joindre : la planche de style.

```
Image 1 is the style reference: keep exactly the same art style.

Draw 4 magic stones for a children's game, side by side from left to right, the same size, evenly spaced with a wide gap between them. Each is a chunky, glossy, faceted gem stone with a soft inner glow and a small white highlight, with a little symbol shining inside it:
1. Plant stone: emerald green with a small glowing leaf inside
2. Ice stone: icy light blue with a small glowing snowflake inside
3. Fire stone: ruby red-orange with a small glowing flame inside
4. Poison stone: deep violet with a small glowing lime-green bubble inside (no pink, no magenta)

Background: perfectly flat solid pure magenta #FF00FF (chroma key), no gradient, no shadow, not transparent, no checkerboard.
STYLE: cute 2D cartoon game items, clean dark outlines, simple cel shading, bright saturated colours. No text. Wide 16:9 image.
```

## Badges des mondes (réussi, verrouillé…)

Joindre : la planche de style. Remplacent le ✅ et le 🔒 sur les cartes des mondes.

```
Image 1 is the style reference: keep exactly the same art style.

Draw 4 cute game badges for a children's game, side by side from left to right, the same size, evenly spaced with a wide gap between them, front view, glossy, with a thick dark outline and a small white highlight:
1. "World completed" badge: a round shiny golden medal with a big pink heart-shaped star in the middle, two short pink and lavender ribbons hanging below it, little sparkles around it
2. "Locked" badge: a chunky cute golden padlock with a heart-shaped keyhole, slightly tilted
3. "Boss defeated" badge: a small golden crown, a bit wonky, with pink gems, sitting on a lavender cushion
4. "Star" badge: a big plump golden star with a soft glow

Background: perfectly flat solid pure green #00FF00 (chroma key), no gradient, no shadow, not transparent, no checkerboard. Do not use green in the badges.
STYLE: cute 2D cartoon game icons, like a modern mobile game for kids, soft rounded shapes, simple cel shading, bright saturated colours. No text, no letters, no numbers. Wide 16:9 image.
```

## Nouveau gardien — Hypnou (psy)

Joindre : la planche de style.

```
Image 1 is the style reference: keep exactly the same art style.

Draw Hypnou, a psychic guardian creature, in its 3 evolution stages, side by side from left to right, all facing the viewer in a 3/4 front view, full body, evenly spaced with a clear gap between them. Each stage is bigger and more impressive than the previous one, but clearly the same creature (same colours, same face, same key features). Hypnou is a small round floating creature, a mix of a baby axolotl and a kitten, lilac and soft violet with pastel pink cheeks, frilly gill-like ears, big sleepy-but-kind eyes, and a glowing pink-violet spiral mark on its forehead. It floats calmly a little above the ground, as if meditating:
1. Baby: tiny and round, floating, eyes half closed and smiling, a small glowing spiral on its forehead, a few tiny sparkles around it
2. Grand (teen): bigger, sitting cross-legged in the air like meditating, two small glowing violet orbs floating around it, longer frilly ears
3. Super (final): majestic, meditating in the air with a soft glowing halo behind its head, a little cape made of starry night sky, three glowing orbs orbiting around it, its forehead spiral shining brightly
Sizes: the baby is about half the height of the super form. Cute, calm and friendly, never scary or creepy.

Background: perfectly flat solid pure green #00FF00 (chroma key), no gradient, no ground shadow, no other objects, not transparent, no checkerboard. Do not use green on the creature.
STYLE: cute 2D cartoon illustration for a children's mobile game, like a modern animated kids' TV show. Soft rounded shapes, big shiny expressive eyes, clean dark outlines, simple cel shading, bright saturated colours. Simple, readable silhouette that is still recognisable when very small. No text. Wide 16:9 image.
```
