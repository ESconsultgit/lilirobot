# 🎨 Les Gardiens de Lili — prompts Gemini

Prompts pour générer les images du jeu avec Gemini (Nano Banana). Ils sont **en anglais** : le modèle suit un peu plus fidèlement les consignes techniques (fond uni, cadrage, « no text ») en anglais. Les noms des personnages restent en français.

## Avancement

- ✅ Étape 1 — planche de style (`sources/planche-de-style.jpg`)
- ✅ Étape 2 — princesse Lili
- ✅ Étape 3 — château
- Étape 4 — gardiens : ✅ Braisou, ✅ Gouttine, ✅ Feuillou, ✅ Zapic, ✅ Givrou, ✅ Plumo ; reste Rocaillou, Étoilette, Lunette, Sousou
- Étapes 5 à 8 — à faire (les images guides des maps ont été refaites le 24/11 : utiliser les versions actuelles)

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
