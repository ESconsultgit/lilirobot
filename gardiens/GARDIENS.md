# 🏰 Les Gardiens de Lili — documentation du jeu

> Tower defense pour enfants. Les Chipeurs veulent atteindre le château de la **princesse Lili**. Dans le château, **Ellie** (robot vert) et **Livia** (robot rose) ont mis au point la défense : elles placent les **gardiens**, de petites créatures mignonnes qui évoluent quand on les améliore.
> Inspiration de gameplay : [PokéPath TD](https://pokepathtd.io/) (l'idée, pas l'identité : toutes les créatures sont originales).

- **Adresse prévue** : https://lilirobot.com/gardiens/ (installable sur téléphone, hors connexion, comme Lili Parc)
- **Code** : `gardiens/index.html` (tout le jeu tient dans ce fichier), `gardiens/sw.js` (hors connexion), `gardiens/manifest.webmanifest`, `gardiens/img/` (images du jeu), icônes `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png` (dessinées par Gemini : la princesse Lili devant son château avec Braisou, Gouttine et Feuillou)
- **Statut** : en ligne (v7). Images Gemini : château, princesse Lili, les 10 gardiens (3 formes chacun), les 6 Chipeurs, le Chef des Chipeurs, les 3 grands boss les 3 fonds de maps et l'icône de l'application sont intégrés. Toutes les images Gemini sont en place.

_Ce document est à mettre à jour à chaque évolution du jeu._

## Étapes du projet

1. ✅ **Conception** : ce document.
2. ✅ **Draft jouable** avec des formes simples (ronds de couleur et emojis) — à tester et à équilibrer.
3. ✅ **Prompts Gemini** : `gardiens/gemini/PROMPTS-GEMINI.md` (avec les images guides des maps et les images de référence d'Ellie et Livia).
4. ✅ **Assemblage** : les images remplacent les formes, le chemin est calé sur chaque fond de map.
5. ✅ **Vidéo de lancement** générée par Gemini (voir [plus bas](#vidéo-de-lancement)).

## L'histoire

Le méchant **Grognon** et sa bande de **Chipeurs** veulent entrer dans le château de la princesse Lili (pour lui chiper sa couronne et son goûter). La princesse, en robe de princesse, regarde depuis son château ; Ellie et Livia sont à ses côtés et donnent les conseils dans les bulles.

Pas de violence : un Chipeur touché assez de fois **éclate en petites étoiles** et rentre chez lui (« … s'enfuit ! » pour les boss).

## Démarrer

- **Vidéo de lancement** à chaque ouverture du jeu, en plein écran, avant « Qui joue ? ». Elle démarre sans le son (les navigateurs bloquent le son tant qu'on n'a pas touché l'écran) : bouton **🔇 Activer le son** en bas à gauche, ou toucher la vidéo. Bouton **Passer ⏭** en bas à droite. Si la vidéo ne se charge pas en 6 secondes (hors connexion), le jeu démarre directement.
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
- **Points de reprise** (tous les cœurs reviennent) : perdu jusqu'à la vague 25 → on reprend à la **vague 1** ; perdu entre les vagues 26 et 49 → on reprend à la **vague 25** ; perdu à la **vague 50** (le grand boss) → on recommence la vague 50 autant de fois qu'il faut. Réglage : `CFG.CHECKPOINT`.

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

**La liste des gardiens** (bouton **🛡️ Gardiens** en bas à gauche, qui affiche aussi « placés / places ») s'ouvre par-dessus la map et montre les 10 gardiens :
- gardien de l'équipe : en couleur, avec ses étoiles et son niveau (pâle s'il est déjà sur la map) ;
- gardien à acheter : grisé avec son prix (surligné en jaune quand on a assez de L$) ; le toucher ouvre la fenêtre d'achat ;
- gardien prisonnier : sombre, avec 🔒 et le monde-vague du boss qui le libère.

**Glisser-déposer** : on fait glisser un gardien de la barre du bas vers un **emplacement** (cercle ➕ près du chemin, 14 par map ; cercles sombres sur la neige pour bien les voir) ; pendant le glisser, sa portée s'affiche sur l'emplacement visé. Sur la map, on fait glisser un gardien vers un autre emplacement pour le déplacer (si l'emplacement est pris, les deux gardiens échangent leur place), ou vers la barre du bas pour le rentrer au château. Un simple toucher sur un gardien ouvre sa fiche ; toucher un cercle libre propose les gardiens disponibles. Chaque gardien est unique et ne se place qu'une fois par map.

**Nombre de gardiens sur la map** selon le niveau : **8** (⭐), **6** (⭐⭐), **5** (⭐⭐⭐) au départ. On peut **acheter des places** en touchant le compteur 🛡️ (le **+** devient rose quand on a assez de L$) : en ⭐ 2 000 puis 10 000 L$, en ⭐⭐ 50 000 puis 200 000 L$, en ⭐⭐⭐ **200 000 puis 500 000 L$**. Les places achetées sont gardées pour toujours, dans tous les mondes, avec un **plafond** par niveau : **10** (⭐, tous les gardiens), **8** (⭐⭐), **7** (⭐⭐⭐). Réglages : `SLOT_MAX`, `SLOT_PRICE`. Le compteur 🛡️ au début de la barre du bas l'affiche (en rose quand c'est plein). Quand c'est plein, il faut rentrer un gardien au château pour en placer un autre : on choisit son équipe selon les méchants du monde. Les gardiens au château peuvent quand même être améliorés.

| | Gardien | Élément | Pouvoir | Dégâts | Portée | Tirs/s |
|---|---|---|---|--:|--:|--:|
| 🔥 | **Braisou** | feu | grosses boules de feu sur un seul méchant, brûlure (25 % des dégâts par seconde pendant 2 s) | 14 | 150 | 0,9 |
| 💧 | **Gouttine** | eau | jets d'eau rapides, éclaboussure autour (rayon 50, 50 % des dégâts) | 6 | 150 | 2,2 |
| 🌿 | **Feuillou** | plante | lianes qui ralentissent de 30 % pendant 1,2 s | 8 | 150 | 1,1 |
| ⚡ | **Zapic** | électricité | éclair qui saute sur 3 méchants (−20 % à chaque saut ; +1 saut par évolution) | 9 | 150 | 1,0 |
| ❄️ | **Givrou** | glace | flocons qui ralentissent de 55 % pendant 1,6 s, en zone | 3 | 150 | 1,1 |
| 🌬️ | **Plumo** | vent | rafale qui fait reculer les méchants à portée (chacun au plus une fois toutes les 3 s, 5 s pour les boss) | 3 | 140 | 0,5 |
| 🪨 | **Rocaillou** | roche | rocher en zone (rayon 70), casse les casques | 22 | 120 | 0,5 |
| ⭐ | **Étoilette** | étoile | voisins proches +25 % de vitesse (+10 % par évolution) ; seule à voir les Fantômes, elle les démasque pour tous | 4 | 150 | 1,2 |
| 🌙 | **Lunette** | lune | tir de très loin sur le méchant qui a le plus de PV | 28 | 270 | 0,45 |
| 🪙 | **Sousou** | pièce | n'attaque pas : fait gagner des LiliDollars à chaque vague | — | — | — |

Valeurs de départ (niveau 0). La map fait 1 600 × 900 unités.

### Fiches techniques des gardiens

Toucher un gardien (sur la map ou dans la barre du bas) ouvre sa **fiche**, une petite fenêtre sur le côté : la map reste visible, avec le gardien en grand à côté (dans l'en-tête sur téléphone). Sa **portée** est dessinée sur la map : cercle blanc = portée actuelle, pointillés jaunes = portée après une amélioration 🎯 de plus (la fiche affiche aussi « 227 → 235 »). Deux onglets : **⬆️ Améliorer** (jauges, cible) et **📋 Fiche technique** : son rôle, ses dégâts par tir, ses tirs par seconde, ses **dégâts par seconde**, sa portée, son effet spécial, ce contre quoi il est fort ou faible, une astuce, son évolution suivante et ses améliorations. Aux niveaux ⭐⭐ et ⭐⭐⭐, elle montre aussi son efficacité **contre l'armure** et **contre la vie**, la jauge **🔨 Anti-armure** (casse-armure) et le choix de sa **cible**. Sur téléphone à l'horizontale, la fiche passe en deux colonnes pour tenir sans faire défiler.

| Gardien | Rôle | Contre l'armure | Contre la vie | Fort contre | Faible contre |
|---|---|--:|--:|---|---|
| 🔥 **Braisou** | dégâts sur la vie, brûlure | ×0,5 | ×1,4 | Costauds, Fusées, Chef des Chipeurs (armure cassée) | armures |
| 💧 **Gouttine** | rouille les armures, zone | ×1,3 | ×0,8 | groupes, Casqués | boss |
| 🌿 **Feuillou** | ralentit | ×0,4 | ×1,1 | Fusées, Costauds | armures, Volants |
| ⚡ **Zapic** | casse-armure, plusieurs méchants | ×1,6 | ×0,9 | Casqués, Dragon, groupes | un boss seul |
| ❄️ **Givrou** | ralentit beaucoup, zone | ×0,7 | ×1,0 | Fusées, groupes, boss | Volants |
| 🌬️ **Plumo** | fait reculer | ×0,3 | ×1,0 | tous ceux qui marchent | Volants, armures |
| 🪨 **Rocaillou** | casse-armure, zone | ×2,5 | ×0,7 | Casqués, Grosse Taupe, Dragon | sans armure ; lent |
| ⭐ **Étoilette** | soutien, seule à voir les Fantômes | ×0,8 | ×1,0 | Fantômes (elle les démasque), aide ses voisins | petits dégâts |
| 🌙 **Lunette** | tir de très loin | ×1,0 | ×1,25 | boss, Costauds | groupes ; lente |
| 🪙 **Sousou** | tirelire | — | — | rapporte des L$ à chaque vague | n'attaque pas, prend une place |

**Cible** (⭐⭐ et ⭐⭐⭐, sauf Plumo et Sousou) : 🏃 **le premier** (le plus avancé sur le chemin, par défaut), 💪 **le plus costaud** (le plus de vie + armure ; par défaut pour Lunette) ou 🛡️ **les armures** (les méchants qui ont encore une armure d'abord). Le choix est gardé pour chaque gardien.

### Bonus et malus des maps

Le décor aide ou gêne certains gardiens (tous les niveaux). Dans la barre du bas, un ▲ vert ou un ▼ rouge signale le bonus ou le malus de la map en cours ; la fiche l'explique.

| Map | Bonus | Malus |
|---|---|---|
| 🌸 Prairie fleurie | Feuillou +25 % de puissance et +10 % de portée (les plantes poussent bien) ; Plumo +15 % de portée (le vent souffle loin) ; Zapic +10 % de puissance (l'orage) | — |
| ❄️ Forêt enneigée | Gouttine +25 % de portée (l'eau glisse sur la neige) ; Givrou +30 % de puissance (le froid) ; Lunette +10 % de portée (nuits claires) | Braisou −15 % de puissance (la neige éteint son feu) |
| 🌋 Volcan | Braisou +30 % de puissance (le feu est chez lui) ; Rocaillou +20 % de puissance et +10 % de portée (des rochers partout) | Givrou −25 % de puissance (la glace fond) ; Gouttine −15 % de portée (l'eau s'évapore) |

### Armure (⭐⭐ et ⭐⭐⭐)

- Les **Casqués** (armure = 1,2 × leurs PV), la **Grosse Taupe Grognon** (casque de mineur, 0,8 × PV) et le **Dragon de Grognon** (écailles, 1 × PV) ont une **armure**.
- Elle s'affiche en **barre bleue** au-dessus de la barre de vie verte, et c'est **elle qui diminue en premier** : tant qu'elle n'est pas cassée, le méchant ne perd pas de vie.
- Chaque coup touche l'armure avec l'efficacité « contre l'armure » du gardien (× la jauge Casse-armure : +6 % par amélioration), puis la vie avec son efficacité « contre la vie ». Quand l'armure casse au milieu d'un coup, le reste du coup passe sur la vie. « Armure cassée ! » s'affiche, et le Casqué montre un 💥.
- Au niveau ⭐ **rien ne change** pour les plus jeunes : pas de barre d'armure, le casque des Casqués divise simplement les dégâts par 2 et Rocaillou le casse. Toutes les efficacités valent ×1.

### Améliorer et évoluer

- Toucher un gardien ouvre sa fiche, avec trois jauges : **💪 Puissance** (×1,12 par amélioration, max 100), **🎯 Portée** (+4 %, max 25), **⏱️ Vitesse** (×1,035, max 40), plus **🔨 Casse-armure** (+6 % contre l'armure par amélioration, max 40) aux niveaux ⭐⭐ et ⭐⭐⭐. Sousou n'a qu'une jauge : **💰 Pièces**.
- Le **niveau** du gardien est le nombre total d'améliorations. Une amélioration coûte **12 × 1,09^niveau** L$, quelle que soit la jauge.
- Chaque gardien **évolue à son rythme** (forme 2 « grand », puis forme 3 « super »). Chaque évolution donne ×1,35 de dégâts, +8 % de portée et +10 % de vitesse, avec un écran « Waouh ! … évolue ! ».

| Gardien | Forme 2 | Forme 3 |
|---|--:|--:|
| 🪙 Sousou | niveau 15 | niveau 45 |
| 🌬️ Plumo | 18 | 50 |
| 💧 Gouttine | 20 | 55 |
| 🔥 Braisou | 20 | 60 |
| ⭐ Étoilette | 20 | 60 |
| ⚡ Zapic | 22 | 65 |
| 🌿 Feuillou | 25 | 70 |
| ❄️ Givrou | 25 | 70 |
| 🪨 Rocaillou | 30 | 80 |
| 🌙 Lunette | 30 | 80 |

- L'onglet **📋 Fiche technique** montre les **3 évolutions** côte à côte avec le niveau de chacune ; la forme actuelle est en surbrillance (cadre jaune), les autres sont grisées.

## Prochaine vague

- Entre deux vagues, un **bandeau** en haut de la map montre les méchants de la prochaine vague avec leur nombre (ex. « Vague 20 : 🦇×5 🐻×1 … »).
- Le toucher (ou le bouton **👀 Vague** à droite) ouvre le détail : nombre total, pastilles (Chef des Chipeurs ou grand boss, ruée de Fusées, volants, fantômes, armures), puis une carte par méchant avec son nombre, sa vie, son armure, sa vitesse, sa particularité et **les gardiens bons contre lui**. Bouton « ▶ Lancer » pour démarrer la vague.
- Les vagues sont toujours les mêmes pour un monde et un numéro de vague donnés (tirage fixe) : ce qu'on voit est exactement ce qui va arriver. Réglages : `FOE_INFO` (texte et gardiens conseillés).

## Les méchants : les Chipeurs

| | Méchant | PV de base | Vitesse | Récompense | Particularité |
|---|---|--:|--:|--:|---|
| 😠 | **Chipeur** | 20 | 55 | 3 | normal |
| 💨 | **Fusée** | 10 | 105 | 2 | petit et très rapide |
| 🐻 | **Costaud** | 75 | 34 | 7 | lent, beaucoup de PV |
| ⛑️ | **Casqué** | 35 | 50 | 5 | casque : en ⭐, dégâts ÷2 sauf Rocaillou qui casse le casque ; en ⭐⭐ et ⭐⭐⭐, **armure** = 1,2 × ses PV |
| 🦇 | **Volant** | 24 | 72 | 4 | vole : ni ralenti ni repoussé |
| 👻 | **Fantôme** | 30 | 58 | 5 | invisible : seule **Étoilette** le voit ; dès qu'elle le touche, il se **transforme en vrai méchant** visible par tous (« Démasqué : … ! ») : un simple Chipeur en ⭐, une surprise en ⭐⭐ et ⭐⭐⭐ (Chipeur, Fusée, Costaud, Casqué ou Volant, avec sa vie et son armure). Réglage : `GHOST_INTO` |
| 😤 | **Chef des Chipeurs** | 40 × Chipeur | 28 | 40 | mini-boss, enlève 5 cœurs |
| 👑 | **Grand boss** | 120 × Chipeur | 28 | 120 | un par monde, enlève 5 cœurs |

- PV : PV de base × 2, puis multipliés par **1,075 à chaque vague** ; les récompenses par **1,07**. Le monde 2 commence comme la vague 46 du monde 1, le monde 3 comme la vague 91.
- Nombre de méchants par vague : **10 + vague × 0,9** (10 à la vague 1, 55 à la vague 50).
- Les boss ne subissent que la moitié des ralentissements et 40 % du recul (une rafale de Plumo toutes les 5 s au plus).

## Niveaux de jeu

Chaque joueur choisit un niveau, modifiable à tout moment dans ⚙️ Menu :

| Niveau | Pour qui | Différence |
|---|---|---|
| ⭐ Petit gardien | dès 6 ans | méchants avec −40 % de PV, 30 cœurs, 8 gardiens sur la map |
| ⭐⭐ Gardien malin | dès 8 ans | réglages normaux, 20 cœurs, 6 gardiens sur la map |
| ⭐⭐⭐ Grand gardien | dès 10 ans | méchants avec +40 % de PV, 10 cœurs, 5 gardiens sur la map |

Équilibrage (25/11, avec l'armure) testé avec un joueur automatique qui place les meilleurs gardiens permis et dépense tout son argent sur eux : en ⭐⭐⭐ il perd 1 fois dans le monde 1, 1 fois dans le monde 2 et 17 fois dans le monde 3 (il faut améliorer et bien choisir son équipe), et les grands boss arrivent jusqu'au château ; en ⭐⭐ il perd 3 fois dans le monde 3 ; en ⭐ rien ne change, c'est confortable. Un enfant, qui dépense moins bien, rencontrera plus de murs. Avant, un Plumo bien amélioré repoussait le boss en continu (il n'avançait presque pas) : c'est corrigé.

## Conseils d'Ellie et Livia

Bulle en bas à gauche de la map (on la ferme en la touchant). Chaque conseil n'apparaît qu'une fois : faire glisser son premier gardien, lancer la vague, premier gardien qu'on peut acheter, mode Auto (vague 3), premier cœur perdu, premiers Casqués, Volants et Fantômes. Les annonces de boss reviennent à chaque fois.

## Écran et téléphone

- Téléphone **à l'horizontale** : infos à gauche (cœurs, L$, vague, monde, joueur), map 16:9 au centre, boutons à droite. En portrait, Livia demande de tourner le téléphone.
- Dessin net à toutes les tailles (jusqu'à ×3 de densité de pixels). L'écran reste allumé pendant le jeu ; quand on quitte l'app pendant une vague, le jeu se met en pause.
- **Mode test** : ajouter `#dev` à l'adresse affiche trois boutons (+ argent, vague +5, gagner la vague).

## Réglages techniques

Constantes en haut du script de `index.html` :

- `SPEC` : fiche technique de chaque gardien (efficacité contre l'armure `arm` et contre la vie `life`, rôle, forces, faiblesses, astuce) ; `KIND_G` relie le type de tir au gardien ; `TARGETS` : les choix de cible. `BIOME` : bonus et malus de chaque map (`pw` puissance, `rg` portée, avec la phrase d'explication). Armure des méchants : `armorK` dans `FOES` et dans les boss de `WORLDS` (× leurs PV).
- `EVO` : niveaux d'évolution de chaque gardien.
- `CFG` : argent de départ, nombre de vagues, croissance des PV et des récompenses, prix et effets des améliorations, maximums des jauges, niveaux d'évolution.
- `DIFF` (niveaux de jeu), `GUARD` (gardiens), `SHOP` (prix des gardiens à acheter), `BOSS_GIFT` (gardiens libérés par les boss), `BENCH_ORDER` (ordre de la barre du bas), `FOES` et `INTRO` (méchants et vague d'apparition), `WORLDS` (chemin `path` de chaque monde, boss), `MINIBOSS`.
- **Emplacements** : calculés automatiquement le long du chemin (`genSpots`). Quand les fonds de map de Gemini arriveront, on les fixera à la main si besoin.
- **Fonds de maps** : `img/map-1|2|3.webp` (1 920 × 1 080, dessinés par Gemini), affichés par `buildBg()` ; le décor dessiné par le code ne sert plus que pendant le chargement. Le tracé `path` de chaque monde a été recalé sur le chemin dessiné. Dans le monde 3, le chemin descend tout près du bord droit : le château y est réduit à 82 % (`cs:0.82` dans `WORLDS`) pour ne pas le cacher.
- **Images** : `ART` liste les gardiens qui ont leurs images (`img/g/<id>-<forme>.webp`, 320 px) ; les autres restent en ronds de couleur. Château : `img/chateau.webp`, placé par `CASTLE` (sa porte, à 27 % de la largeur et 82 % de la hauteur, est au bout du chemin, en x = 1 390). Princesse : `img/princesse-contente|inquiete|victoire.webp` (« Qui joue ? », annonces de boss, défaite, victoire).
- **Méchants** : `img/f/<type>.webp` (chipeur, fusee, costaud, casque, volant, fantome, chef), dessinés de profil tournés vers la droite ; le jeu les retourne quand ils vont vers la gauche. Un Casqué dont le casque est cassé affiche 💥. Grands boss : `img/f/boss-taupe|yeti|dragon.webp` ; la taupe et le dragon sont dessinés tournés vers la gauche, ce qu'indique `FOE_FACE` pour que le jeu les tourne dans le bon sens.
- **Préparer une image Gemini** : `python3 gemini/cut.py <source.jpg> <green|magenta|blue> <nombre de personnages> <taille max> <sorties…>` retire le fond uni, découpe la planche en personnages et enregistre des `.webp`. Les originaux sont gardés dans `gemini/sources/`. Si des personnages se chevauchent en colonnes (un volant au-dessus d'un autre), utiliser `gemini/cut_blobs.py` (mêmes arguments), qui sépare par taches et retire aussi les ombres vert foncé.
- Sauvegardes : `gardiens-profiles` (liste des joueurs), `gardiens-<id>` (partie de chaque joueur), `gardiens-last`.
- **Après chaque modification** : incrémenter `VERSION` dans `gardiens/sw.js` et mettre à jour ce document.
- **Mise en ligne** : en ligne sur lilirobot.com/gardiens/ et dans le menu Détente du site (ligne dans `JEUX`, `assets/menu.js`).

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

**`gardiens/video/lancement.mp4`** — https://lilirobot.com/gardiens/video/lancement.mp4 (30 s, 1 280 × 720, avec musique et bruitages). Générée par Gemini Omni en 3 plans de 10 s (le château en danger, les gardiens entrent en jeu, le grand boss et la victoire) avec les prompts de `gemini/PROMPTS-GEMINI.md`. Le titre « Les Gardiens de Lili » et l'adresse lilirobot.com/gardiens sont ajoutés par-dessus dans les 4 dernières secondes (`gemini/video/titre.png`, police Baloo 2). Original sans titre : `gemini/sources/video-lancement-gemini.mp4`. Elle passe au démarrage du jeu (`showIntro()`). Elle n'est pas mise en cache hors connexion (`sw.js` laisse passer les `.mp4` vers le réseau).

## Questions ouvertes

- Les noms des gardiens et des méchants sont-ils validés ?
- Faut-il des badges, comme dans Lili Parc ?
- Ajouter d'autres mondes plus tard (plage, château de Grognon) ?

## Historique des versions

- **v0 (draft)** — 3 mondes de 50 vagues, 10 gardiens avec 3 jauges et 2 évolutions, 6 méchants + boss, recrutement après les boss, points de reprise, mode Auto, vitesse ×3, niveaux de jeu, joueurs. Formes simples en attendant les images.
- **v2** — premières images Gemini : château (au bout du chemin, qui s'arrête maintenant en x = 1 390 ; chemin du monde 3 retouché), princesse Lili dans les fenêtres, Braisou, Gouttine et Feuillou dans leurs 3 formes.
- **v3** — images de Zapic, Givrou et Plumo (3 formes chacun).
- **v4** — images de Rocaillou, Étoilette, Lunette et Sousou ; images des 6 Chipeurs et du Chef des Chipeurs, qui se tournent dans le sens de la marche.
- **v5** — images des 3 grands boss (Grosse Taupe Grognon, Yéti Ronchon, Dragon de Grognon).
- **v6** — fonds de maps Gemini pour les 3 mondes, chemins recalés dessus, château plus petit dans le monde 3.
- **v7** — icône de l'application (Gemini) ; toutes les images du jeu sont en place.
- **v8** — vidéo de lancement (`video/lancement.mp4`).
- **v9** — la vidéo de lancement passe au démarrage du jeu, avec les boutons « Activer le son » et « Passer ».
- **v10** — équilibrage : vagues plus longues (10 + vague × 0,9 méchants), PV de base × 2, boss plus costauds (40 et 120 Chipeurs), croissance des PV et des prix revue ; nombre de gardiens sur la map limité selon le niveau (8 / 6 / 5) ; Plumo ne peut plus bloquer un méchant en continu ; emplacements sombres sur la map neige.
- **v11** — armure (barre bleue qui diminue en premier) pour les Casqués, la Grosse Taupe et le Dragon en ⭐⭐ et ⭐⭐⭐ ; efficacité de chaque gardien contre l'armure et contre la vie ; jauge Casse-armure ; choix de la cible ; fiche technique complète de chaque gardien. Le niveau ⭐ ne change pas.
- **v12** — fiche plus petite sur le côté avec le gardien en grand, portée dessinée sur la map (actuelle et après une amélioration), onglets Améliorer / Fiche technique ; bonus et malus des maps selon le gardien.
- **v13** — évolutions plus lentes et propres à chaque gardien (ex. Braisou 20 et 60, Feuillou 25 et 70, Rocaillou 30 et 80) ; les 3 évolutions affichées dans la fiche technique, la forme actuelle en surbrillance.
- **v14** — Fantômes : seule Étoilette les voit (elle vise d'abord ceux qui sont cachés) ; dès qu'elle en touche un, il est visible pour tous. Lunette ne les voit plus.
- **v15** — fiche sans défilement sur téléphone : deux colonnes (à gauche le gardien, son rôle, le bonus de la map, les onglets ; à droite les jauges et la cible, ou les évolutions et les chiffres), l'astuce n'apparaît que sur grand écran ; « Casse-armure » s'appelle « Anti-armure » dans la fiche.
- **v16** — la fiche garde la même taille entre les onglets Améliorer et Fiche technique (les deux sont dans la page, l'un caché).
- **v17** — nouveaux points de reprise : vague 1 jusqu'à la vague 25, puis vague 25, et le grand boss de la vague 50 se rejoue sans reculer.
- **v18** — fiche redessinée : en-tête (image, nom, rôle, forme et niveau, boutons 🏰 Rentrer et ✕ Fermer), barre de progression vers l'évolution, bonus de la map en pastille, onglets « Améliorer / Infos » en contrôle segmenté ; 4 cartes d'amélioration (toute la carte est le bouton, valeur actuelle → après), cible en contrôle segmenté ; infos : 3 évolutions, 4 chiffres en tuiles, effet, armure/vie, fort/faible ; pied fixe avec tes L$ et le prix d'une amélioration. Tient sans défilement sur téléphone.
- **v19** — aperçu de la prochaine vague : bandeau en haut de la map et fenêtre détaillée (méchants, nombre, vie, armure, vitesse, gardiens conseillés).
- **v20** — dégâts de zone bien visibles : onde de choc qui s'étend jusqu'au bord de la zone touchée (disque coloré, bord lumineux, second anneau, éclaboussures) pour Gouttine (bleu), Givrou (bleu glacé), Rocaillou (brun) ; rafale de Plumo avec des traits de vent qui tournent. Réglage : `WAVE_STYLE`.
- **v21** — places sur la map à acheter (plafond 10 / 8 / 7) ; les Fantômes démasqués se transforment en vrai méchant (Chipeur en ⭐, surprise en ⭐⭐ et ⭐⭐⭐).
- **v22** — places plus chères selon le niveau (⭐⭐⭐ : 200 000 puis 500 000 L$).
- **v23** — la map prend tout l'écran ; tout flotte par-dessus : infos (monde, cœurs, L$, vague) en haut à gauche, prochaine vague toujours affichée en haut au milieu (le bouton 👀 Vague est supprimé), menu déroulant ☰ en haut à droite (Auto, vitesse, pause, équipe, menu), ▶ Vague en bas à droite, et la liste des gardiens qui s'ouvre avec le bouton 🛡️ Gardiens en bas à gauche.
- **v1** — glisser-déposer des gardiens (barre du bas → map, map → map avec échange, map → barre pour les rentrer) ; gardiens achetés en LiliDollars ou libérés par les boss (remplace le choix après chaque boss) ; « joueur » au lieu de « joueuse » dans le jeu (un copain peut jouer aussi).
