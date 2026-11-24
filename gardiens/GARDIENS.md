# 🏰 Les Gardiens de Lili — documentation du jeu

> Tower defense pour enfants. Les Chipeurs veulent atteindre le château de la **princesse Lili**. Dans le château, **Ellie** (robot vert) et **Livia** (robot rose) ont mis au point la défense : elles placent les **gardiens**, de petites créatures mignonnes qui évoluent quand on les améliore.
> Inspiration de gameplay : [PokéPath TD](https://pokepathtd.io/) (l'idée, pas l'identité : toutes les créatures sont originales).

- **Adresse prévue** : https://lilirobot.com/gardiens/ (installable sur téléphone, hors connexion, comme Lili Parc)
- **Code** : `gardiens/index.html` (tout le jeu tient dans ce fichier), `gardiens/sw.js` (hors connexion), `gardiens/manifest.webmanifest`, `gardiens/img/` (Ellie et Livia), icônes provisoires
- **Statut** : draft jouable (v2). Images Gemini en cours : château, princesse Lili, Braisou, Gouttine et Feuillou sont intégrés ; les autres gardiens et les méchants sont encore en formes simples.

_Ce document est à mettre à jour à chaque évolution du jeu._

## Étapes du projet

1. ✅ **Conception** : ce document.
2. ✅ **Draft jouable** avec des formes simples (ronds de couleur et emojis) — à tester et à équilibrer.
3. ✅ **Prompts Gemini** : `gardiens/gemini/PROMPTS-GEMINI.md` (avec les images guides des maps et les images de référence d'Ellie et Livia).
4. **Assemblage** (en cours) : les images remplacent les formes, le chemin est calé sur chaque fond de map.
5. **Vidéo de lancement** générée par Gemini, une fois le design validé (voir [plus bas](#vidéo-de-lancement)).

## L'histoire

Le méchant **Grognon** et sa bande de **Chipeurs** veulent entrer dans le château de la princesse Lili (pour lui chiper sa couronne et son goûter). La princesse, en robe de princesse, regarde depuis son château ; Ellie et Livia sont à ses côtés et donnent les conseils dans les bulles.

Pas de violence : un Chipeur touché assez de fois **éclate en petites étoiles** et rentre chez lui (« … s'enfuit ! » pour les boss).

## Démarrer

- Écran **« Qui joue ? »** : chaque joueur ou joueuse a sa partie (prénom, avatar, niveau), sauvegardée dans le navigateur du téléphone.
- À la première partie, Ellie et Livia racontent l'histoire et on **choisit son premier gardien** parmi Braisou, Gouttine et Feuillou, puis on le fait glisser sur la map.
- Écran **🗺️ Choisis ton monde** : progression de chaque monde, mondes suivants verrouillés tant que le précédent n'est pas réussi.

## Les mondes et les vagues

| Monde | Décor | Nouveaux méchants | Grand boss (vague 50) |
|---|---|---|---|
| 🌸 1. La Prairie fleurie | prairie, fleurs, arbres | Chipeur (vague 1), Fusée (3), Costaud (6) | La Grosse Taupe Grognon |
| ❄️ 2. La Forêt enneigée | sapins, neige | + Casqué (2), Volant (5) | Le Yéti Ronchon |
| 🌋 3. Le Volcan | roches, lave, cristaux | + Fantôme (3) | Le Dragon de Grognon |

- Chaque monde compte **50 vagues**. Il faut les réussir toutes pour débloquer le monde suivant. Un monde réussi peut être rejoué depuis la vague 1 (pour gagner des L$).
- **Chef des Chipeurs** (mini-boss) aux vagues 10, 20, 30 et 40 ; **grand boss** du monde à la vague 50.
- Toutes les 5 vagues (hors boss) : une **ruée de Fusées**.
- Le **château** a des **cœurs** (selon le niveau). Chaque Chipeur qui arrive enlève 1 cœur, un boss 5. À 0, la partie est perdue.
- **Lancer les vagues** : bouton ▶ **Vague N**, ou 🔁 **Auto** qui enchaîne les vagues toutes seules (2,5 s entre deux vagues). Vitesse ×1, ×2, ×3 et ⏸ Pause.
- **Points de reprise** : si on perd, on reprend à la dernière vague de boss réussie (11, 21, 31, 41), avec tous les cœurs.

## L'argent et la progression

- Les **LiliDollars (L$)** se gagnent en battant les méchants, avec un bonus à chaque vague réussie (et grâce à Sousou).
- Ils servent à **acheter** certains gardiens et à les **améliorer**. Placer un gardien est gratuit.
- **Tout est gardé**, même après une défaite : LiliDollars, gardiens et améliorations. Perdre ne fait jamais perdre ce qu'on a gagné : on s'améliore et on réessaie.
- La partie est sauvegardée à la fin de chaque vague (une vague interrompue recommence).

## Les gardiens

On commence avec **1 gardien parmi 3** (Braisou, Gouttine ou Feuillou). Les autres s'obtiennent de deux façons :

| Comment | Gardiens |
|---|---|
| 🛒 **Achat en LiliDollars** | les 2 gardiens de départ non choisis (150 L$ chacun), Sousou (400 L$), Zapic (700 L$), Givrou (1 200 L$) |
| 👑 **Libérés par le Chef des Chipeurs** (la première fois qu'on le bat) | Plumo (monde 1, vague 20), Rocaillou (monde 1, vague 40), Étoilette (monde 2, vague 20), Lunette (monde 2, vague 40) |

**La barre du bas**, sous la map, montre les 10 gardiens :
- gardien de l'équipe : en couleur, avec ses étoiles et son niveau (pâle s'il est déjà sur la map) ;
- gardien à acheter : grisé avec son prix (surligné en jaune quand on a assez de L$) ; le toucher ouvre la fenêtre d'achat ;
- gardien prisonnier : sombre, avec 🔒 et le monde-vague du boss qui le libère.

**Glisser-déposer** : on fait glisser un gardien de la barre du bas vers un **emplacement** (cercle ➕ près du chemin, 14 par map) ; pendant le glisser, sa portée s'affiche sur l'emplacement visé. Sur la map, on fait glisser un gardien vers un autre emplacement pour le déplacer (si l'emplacement est pris, les deux gardiens échangent leur place), ou vers la barre du bas pour le rentrer au château. Un simple toucher sur un gardien ouvre sa fiche ; toucher un cercle libre propose les gardiens disponibles. Chaque gardien est unique et ne se place qu'une fois par map.

| | Gardien | Élément | Pouvoir | Dégâts | Portée | Tirs/s |
|---|---|---|---|--:|--:|--:|
| 🔥 | **Braisou** | feu | grosses boules de feu sur un seul méchant, brûlure (25 % des dégâts par seconde pendant 2 s) | 14 | 150 | 0,9 |
| 💧 | **Gouttine** | eau | jets d'eau rapides, éclaboussure autour (rayon 50, 50 % des dégâts) | 6 | 150 | 2,2 |
| 🌿 | **Feuillou** | plante | lianes qui ralentissent de 30 % pendant 1,2 s | 8 | 150 | 1,1 |
| ⚡ | **Zapic** | électricité | éclair qui saute sur 3 méchants (−20 % à chaque saut ; +1 saut par évolution) | 9 | 150 | 1,0 |
| ❄️ | **Givrou** | glace | flocons qui ralentissent de 55 % pendant 1,6 s, en zone | 3 | 150 | 1,1 |
| 🌬️ | **Plumo** | vent | rafale qui fait reculer tous les méchants à portée | 3 | 140 | 0,5 |
| 🪨 | **Rocaillou** | roche | rocher en zone (rayon 70), casse les casques | 22 | 120 | 0,5 |
| ⭐ | **Étoilette** | étoile | voisins proches +25 % de vitesse (+10 % par évolution), voit les fantômes | 4 | 150 | 1,2 |
| 🌙 | **Lunette** | lune | tir de très loin sur le méchant qui a le plus de PV, voit les fantômes | 28 | 270 | 0,45 |
| 🪙 | **Sousou** | pièce | n'attaque pas : fait gagner des LiliDollars à chaque vague | — | — | — |

Valeurs de départ (niveau 0). La map fait 1 600 × 900 unités.

### Améliorer et évoluer

- Toucher un gardien ouvre sa fiche, avec trois jauges : **💪 Puissance** (×1,12 par amélioration, max 100), **🎯 Portée** (+4 %, max 25), **⏱️ Vitesse** (×1,035, max 40). Sousou n'a qu'une jauge : **💰 Pièces**.
- Le **niveau** du gardien est le nombre total d'améliorations. Une amélioration coûte **12 × 1,11^niveau** L$, quelle que soit la jauge.
- Au **niveau 10**, il **évolue** (forme 2 « grand ») ; au **niveau 25**, il évolue encore (forme 3 « super »). Chaque évolution donne ×1,35 de dégâts, +8 % de portée et +10 % de vitesse, avec un écran « Waouh ! … évolue ! ».

## Les méchants : les Chipeurs

| | Méchant | PV de base | Vitesse | Récompense | Particularité |
|---|---|--:|--:|--:|---|
| 😠 | **Chipeur** | 20 | 55 | 3 | normal |
| 💨 | **Fusée** | 10 | 105 | 2 | petit et très rapide |
| 🐻 | **Costaud** | 75 | 34 | 7 | lent, beaucoup de PV |
| ⛑️ | **Casqué** | 35 | 50 | 5 | casque : dégâts ÷2, sauf Rocaillou qui casse le casque |
| 🦇 | **Volant** | 24 | 72 | 4 | vole : ni ralenti ni repoussé |
| 👻 | **Fantôme** | 30 | 58 | 5 | invisible, sauf à portée d'Étoilette ou de Lunette |
| 😤 | **Chef des Chipeurs** | 24 × Chipeur | 28 | 40 | mini-boss, enlève 5 cœurs |
| 👑 | **Grand boss** | 70 × Chipeur | 28 | 120 | un par monde, enlève 5 cœurs |

- Les PV sont multipliés par **1,09 à chaque vague**, et les récompenses par **1,075**. Le monde 2 commence comme la vague 46 du monde 1, le monde 3 comme la vague 91.
- Nombre de méchants par vague : 6 + vague × 0,45.
- Les boss ne subissent que la moitié des ralentissements et 40 % du recul.

## Niveaux de jeu

Chaque joueur choisit un niveau, modifiable à tout moment dans ⚙️ Menu :

| Niveau | Pour qui | Différence |
|---|---|---|
| ⭐ Petit gardien | dès 6 ans | méchants avec −40 % de PV, 30 cœurs |
| ⭐⭐ Gardien malin | dès 8 ans | réglages normaux, 20 cœurs |
| ⭐⭐⭐ Grand gardien | dès 10 ans | méchants avec +40 % de PV, 10 cœurs |

Équilibrage testé avec un joueur automatique qui dépense tout son argent au mieux : il finit les 3 mondes à tous les niveaux, avec quelques défaites dans le monde 3 en ⭐⭐⭐. Un enfant, qui dépense moins bien, devrait rencontrer des murs et devoir s'améliorer pour passer (comme dans PokéPath). À affiner avec les vraies parties.

## Conseils d'Ellie et Livia

Bulle en bas à gauche de la map (on la ferme en la touchant). Chaque conseil n'apparaît qu'une fois : faire glisser son premier gardien, lancer la vague, premier gardien qu'on peut acheter, mode Auto (vague 3), premier cœur perdu, premiers Casqués, Volants et Fantômes. Les annonces de boss reviennent à chaque fois.

## Écran et téléphone

- Téléphone **à l'horizontale** : infos à gauche (cœurs, L$, vague, monde, joueur), map 16:9 au centre, boutons à droite. En portrait, Livia demande de tourner le téléphone.
- Dessin net à toutes les tailles (jusqu'à ×3 de densité de pixels). L'écran reste allumé pendant le jeu ; quand on quitte l'app pendant une vague, le jeu se met en pause.
- **Mode test** : ajouter `#dev` à l'adresse affiche trois boutons (+ argent, vague +5, gagner la vague).

## Réglages techniques

Constantes en haut du script de `index.html` :

- `CFG` : argent de départ, nombre de vagues, croissance des PV et des récompenses, prix et effets des améliorations, maximums des jauges, niveaux d'évolution.
- `DIFF` (niveaux de jeu), `GUARD` (gardiens), `SHOP` (prix des gardiens à acheter), `BOSS_GIFT` (gardiens libérés par les boss), `BENCH_ORDER` (ordre de la barre du bas), `FOES` et `INTRO` (méchants et vague d'apparition), `WORLDS` (chemin `path` de chaque monde, boss), `MINIBOSS`.
- **Emplacements** : calculés automatiquement le long du chemin (`genSpots`). Quand les fonds de map de Gemini arriveront, on les fixera à la main si besoin.
- **Décor provisoire** : dessiné par `buildBg()` (sera remplacé par les images de Gemini).
- **Images** : `ART` liste les gardiens qui ont leurs images (`img/g/<id>-<forme>.webp`, 320 px) ; les autres restent en ronds de couleur. Château : `img/chateau.webp`, placé par `CASTLE` (sa porte, à 27 % de la largeur et 82 % de la hauteur, est au bout du chemin, en x = 1 390). Princesse : `img/princesse-contente|inquiete|victoire.webp` (« Qui joue ? », annonces de boss, défaite, victoire).
- **Préparer une image Gemini** : `python3 gemini/cut.py <source.jpg> <green|magenta|blue> <nombre de personnages> <taille max> <sorties…>` retire le fond uni, découpe la planche en personnages et enregistre des `.webp`. Les originaux sont gardés dans `gemini/sources/`.
- Sauvegardes : `gardiens-profiles` (liste des joueurs), `gardiens-<id>` (partie de chaque joueur), `gardiens-last`.
- **Après chaque modification** : incrémenter `VERSION` dans `gardiens/sw.js` et mettre à jour ce document.
- **Mise en ligne** : ajouter une ligne dans `JEUX` (`assets/menu.js`) quand le jeu est prêt pour le menu Détente.

## Liste des images pour Gemini

Style commun : **dessin animé mignon**, couleurs vives, contours doux, gros yeux. On génère d'abord une **planche de style** (quelques gardiens et un Chipeur ensemble) et on la donne en référence à chaque prompt suivant, pour que tout se ressemble.

Gemini ne sait pas faire de vrai fond transparent : chaque personnage est demandé **sur un fond uni d'une seule couleur** (précisée dans chaque prompt), que je retire ensuite.

| Image | Nombre | Format | Notes |
|---|--:|---|---|
| Planche de style | 1 | 1920 × 1080 | référence pour toutes les autres images |
| Princesse Lili | 3 | 1024 × 1024 | contente, inquiète, victoire (pour les bulles et les écrans) |
| Château de Lili | 1 | 1024 × 1024 | vu de 3/4, Lili au balcon avec Ellie et Livia (donner les images d'Ellie et Livia à Gemini) |
| Gardiens | 10 × 3 formes = 30 | 1024 × 1024 chacun | vue de 3/4 face, même cadrage d'une forme à l'autre ; Sousou peut n'avoir qu'une forme |
| Chipeurs | 6 + Chef des Chipeurs | 1024 × 1024 | vus de côté, tournés vers la droite (le code les retourne) |
| Boss | 3 | 1024 × 1024 | Grosse Taupe Grognon, Yéti Ronchon, Dragon de Grognon |
| Fonds de maps | 3 | 1920 × 1080 | vue de dessus ; je fournis une **image guide** avec le chemin et le château tracés, à donner à Gemini pour qu'il dessine le décor autour du même chemin |
| Icône de l'application | 1 | 1024 × 1024 | Lili devant son château |

Total : environ **49 images**. Les gardiens s'affichent aussi en petit (40 px) dans la barre du bas : ils doivent rester reconnaissables en tout petit (silhouette simple, couleur dominante bien marquée). Les projectiles (boules de feu, flocons, éclairs) et les effets sont dessinés par le code.

## Vidéo de lancement

Une fois le design validé (images assemblées), on demandera à Gemini une **vidéo de lancement** du jeu, à partir des images finales (princesse, château, gardiens, Chipeurs). Prompt à préparer à ce moment-là.

## Questions ouvertes

- Les noms des gardiens et des méchants sont-ils validés ?
- Faut-il des badges, comme dans Lili Parc ?
- Ajouter d'autres mondes plus tard (plage, château de Grognon) ?

## Historique des versions

- **v0 (draft)** — 3 mondes de 50 vagues, 10 gardiens avec 3 jauges et 2 évolutions, 6 méchants + boss, recrutement après les boss, points de reprise, mode Auto, vitesse ×3, niveaux de jeu, joueurs. Formes simples en attendant les images.
- **v2** — premières images Gemini : château (au bout du chemin, qui s'arrête maintenant en x = 1 390 ; chemin du monde 3 retouché), princesse Lili dans les fenêtres, Braisou, Gouttine et Feuillou dans leurs 3 formes.
- **v1** — glisser-déposer des gardiens (barre du bas → map, map → map avec échange, map → barre pour les rentrer) ; gardiens achetés en LiliDollars ou libérés par les boss (remplace le choix après chaque boss) ; « joueur » au lieu de « joueuse » dans le jeu (un copain peut jouer aussi).
