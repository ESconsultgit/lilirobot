# 🎲 MonopoLili — documentation du jeu

> Le Monopoly de Lili, pour jouer à plusieurs sur un seul téléphone ou une tablette, avec Ellie (robot vert) et Livia (robot rose) de [L'atelier de Lili](https://lilirobot.com) comme conseillères. Monnaie : les **LiliDollars (L$)**.
> Même principe que le vrai Monopoly : on achète des endroits, on encaisse des loyers, on construit, et le dernier qui n'a pas fait faillite gagne.

- **Adresse** : https://lilirobot.com/monopolili/ (installable sur téléphone comme une application)
- **Code** : `monopolili/index.html` (tout le jeu tient dans ce fichier), `monopolili/sw.js` (hors connexion), `monopolili/manifest.webmanifest`, `monopolili/img/` (Ellie et Livia)
- **Mise en ligne** : chaque fusion sur `main` est envoyée par FTP sur OVH (GitHub Actions, `.github/workflows/deploy.yml`)

_Ce document est à mettre à jour à chaque évolution du jeu._

## Démarrer une partie

- De **2 à 6 joueurs**, chacun avec un prénom, un pion (🦄 🐱 🐶 🦖 🐸 🐼 🦊 🐰 🐙 🚀 🍦 🌟 🤖) et une couleur.
- Chaque joueur peut être **humain** ou **robot** (l'ordinateur joue tout seul) : on peut donc jouer seul contre un ou plusieurs robots.
- **Durée** : « Jusqu'au bout » (vraie règle : jusqu'à ce qu'il ne reste qu'un joueur), « Courte » (15 tours) ou « Moyenne » (30 tours). En partie à tours limités, le plus riche gagne (fortune = argent + prix des endroits + constructions ; un endroit en pause compte pour la moitié).
- **Argent de départ** : 1 000, 1 500 (comme le vrai jeu) ou 2 000 L$.
- **Panier du pique-nique** (règle maison, désactivée par défaut) : taxes, amendes et sorties de chambre vont dans un panier ; celui qui s'arrête sur le Pique-nique le ramasse.
- La partie est **sauvegardée** dans le téléphone à chaque action ; « ↩️ Reprendre la partie » sur l'écran de départ. Le dernier réglage de joueurs est mémorisé.

## Le tour de jeu

- On lance **deux dés**. Un **double** fait rejouer ; **3 doubles de suite** envoient ranger sa chambre (prison).
- Passer par **Départ** rapporte **200 L$**.
- Endroit libre : on peut l'**acheter** au prix indiqué, ou dire « Non merci » (pas d'enchères dans cette version).
- Endroit d'un autre joueur : on paie le **loyer** (sauf s'il est en pause 💤).
- Toucher une case du plateau affiche sa **carte** (prix, loyers, propriétaire). Toucher un joueur affiche ses endroits et sa fortune.

## Le plateau

| Case | Nom | Couleur | Prix | Loyer nu → 1, 2, 3, 4 cabanes → château | Cabane |
|--:|---|---|--:|---|--:|
| 0 | 🚩 Départ | | | +200 L$ en passant | |
| 1 | 🧦 Impasse des Chaussettes Sales | marron | 60 | 2 → 10, 30, 90, 160 → 250 | 50 |
| 2 | 🎁 Surprise de Lili | | | carte | |
| 3 | 💨 Ruelle du Prout Mystère | marron | 60 | 4 → 20, 60, 180, 320 → 450 | 50 |
| 4 | 🍬 Taxe des Bonbons | | | paie 200 | |
| 5 | 🚂 Gare du Train Tchou-Tchou | gare | 200 | | |
| 6 | 🐌 Allée des Limaces Rigolotes | bleu ciel | 100 | 6 → 30, 90, 270, 400 → 550 | 50 |
| 7 | 🍀 Chance | | | carte | |
| 8 | 🫧 Rue du Chewing-gum Collé | bleu ciel | 100 | 6 → 30, 90, 270, 400 → 550 | 50 |
| 9 | 😘 Boulevard des Bisous Baveux | bleu ciel | 120 | 8 → 40, 100, 300, 450 → 600 | 50 |
| 10 | 🛏️ Chambre en désordre | | | prison / simple visite | |
| 11 | 🧸 Cité des Peluches Péteuses | rose | 140 | 10 → 50, 150, 450, 625 → 750 | 100 |
| 12 | 🧼 Usine à Bulles de Savon | usine | 150 | | |
| 13 | 🦄 Place des Licornes Enrhumées | rose | 140 | 10 → 50, 150, 450, 625 → 750 | 100 |
| 14 | 🪶 Avenue des Chatouilles | rose | 160 | 12 → 60, 180, 500, 700 → 900 | 100 |
| 15 | 🛁 Port des Bateaux-Baignoires | gare | 200 | | |
| 16 | 🥞 Rue des Crêpes Volantes | orange | 180 | 14 → 70, 200, 550, 750 → 950 | 100 |
| 17 | 🎁 Surprise de Lili | | | carte | |
| 18 | 🦖 Square des Dinos en Pyjama | orange | 180 | 14 → 70, 200, 550, 750 → 950 | 100 |
| 19 | 🦆 Quai des Canards Farceurs | orange | 200 | 16 → 80, 220, 600, 800 → 1 000 | 100 |
| 20 | 🧺 Pique-nique | | | repos (ou panier) | |
| 21 | 🏴‍☠️ Avenue des Pirates Chatouilleux | rouge | 220 | 18 → 90, 250, 700, 875 → 1 050 | 150 |
| 22 | 🍀 Chance | | | carte | |
| 23 | 🐉 Boulevard du Dragon qui Éternue | rouge | 220 | 18 → 90, 250, 700, 875 → 1 050 | 150 |
| 24 | 🌋 Place du Volcan en Chocolat | rouge | 240 | 20 → 100, 300, 750, 925 → 1 100 | 150 |
| 25 | 🎈 Gare des Montgolfières | gare | 200 | | |
| 26 | 🍌 Rue des Bananes Dansantes | jaune | 260 | 22 → 110, 330, 800, 975 → 1 150 | 150 |
| 27 | 🤖 Avenue des Robots Rigolos | jaune | 260 | 22 → 110, 330, 800, 975 → 1 150 | 150 |
| 28 | 🟢 Fabrique de Slime | usine | 150 | | |
| 29 | ✨ Allée des Paillettes Magiques | jaune | 280 | 24 → 120, 360, 850, 1 025 → 1 200 | 150 |
| 30 | 🧹 Va ranger ta chambre ! | | | aller en prison | |
| 31 | 🚀 Boulevard des Fusées à Bulles | vert | 300 | 26 → 130, 390, 900, 1 100 → 1 275 | 200 |
| 32 | 🍭 Avenue du Château de Bonbons | vert | 300 | 26 → 130, 390, 900, 1 100 → 1 275 | 200 |
| 33 | 🎁 Surprise de Lili | | | carte | |
| 34 | 🧜‍♀️ Place des Sirènes qui Chantent Faux | vert | 320 | 28 → 150, 450, 1 000, 1 200 → 1 400 | 200 |
| 35 | 🐷 Aéroport des Cochons Volants | gare | 200 | | |
| 36 | 🍀 Chance | | | carte | |
| 37 | 🌈 Avenue des Arcs-en-ciel | bleu nuit | 350 | 35 → 175, 500, 1 100, 1 300 → 1 500 | 200 |
| 38 | 🦷 Amende du Dentiste | | | paie 100 | |
| 39 | 👑 Le Palais de Lili | bleu nuit | 400 | 50 → 200, 600, 1 400, 1 700 → 2 000 | 200 |

Prix et loyers identiques au Monopoly classique.

- **Toute une couleur** : le loyer nu est **doublé**, et on peut construire.
- **Gares** : 25 / 50 / 100 / 200 L$ selon le nombre de gares du propriétaire.
- **Usines** : 4 × les dés (1 usine) ou 10 × les dés (2 usines).

## Construire, revendre, mettre en pause

Bouton **🏠 Mes endroits** (pendant son tour) :

- **Cabanes 🛖** (= maisons) : seulement si on a toute la couleur et qu'aucune case de la couleur n'est en pause. On construit **en équilibrant** (pas de 2e cabane tant que les autres cases de la couleur n'en ont pas une). Après 4 cabanes : un **château 🏰** (= hôtel), même prix. Pas de limite de stock.
- **Revendre** une construction : la banque rend la moitié de son prix (en équilibrant aussi).
- **Mettre en pause 💤** (= hypothèque) : la banque donne la moitié du prix ; l'endroit ne rapporte plus de loyer. Impossible s'il y a des constructions sur la couleur. **Réveiller** coûte la moitié du prix + 10 %.

## Échanger

Bouton **🤝 Échanger** (pendant son tour, hors chambre en désordre) : on choisit un joueur, les endroits que l'on donne et que l'on reçoit, et de l'argent dans un sens ou dans l'autre. L'autre joueur accepte ou refuse (sur le même téléphone). On ne peut pas échanger une couleur qui a des constructions.

Les **robots** :

- acceptent un échange s'il est assez avantageux pour eux (ils se méfient quand on veut finir une couleur grâce à eux) ;
- proposent, à la fin de leur tour, d'**acheter la case qui leur manque** pour finir une couleur (environ 1,6 à 2,2 fois son prix), ou un **échange gagnant-gagnant** si chacun finit une couleur. Un humain reçoit la proposition avec un avertissement (« il pourra construire des cabanes ! »). Au plus une proposition par tour, et pas deux fois la même avant 4 tours.

## Chambre en désordre (prison)

- On y va par la case **🧹 Va ranger ta chambre !**, une carte, ou 3 doubles de suite. On ne passe pas par Départ.
- Pour sortir : faire un **double** (on avance, sans rejouer), **payer 50 L$** avant de lancer, ou utiliser la carte **« Maman range ta chambre »**. Au **3e essai raté**, on paie 50 L$ et on avance.
- En prison, on continue de toucher ses loyers.

## Cartes

**🍀 Chance** (16 cartes) : aller à Départ ; au Palais de Lili ; au Boulevard du Dragon qui Éternue ; à la Cité des Peluches Péteuses ; à la Gare du Train Tchou-Tchou ; 2 × gare la plus proche (loyer double) ; usine la plus proche (10 × les dés) ; pièce sous le canapé +50 ; « Maman range ta chambre » ; peau de banane (recule de 3) ; va ranger ta chambre ; chien qui mâchouille (25/cabane, 100/château) ; rot à table −15 ; chef des chatouilles (50 à chaque joueur) ; collection de cailloux +150.

**🎁 Surprise de Lili** (16 cartes) : Départ ; petite souris +200 ; dentiste −50 ; limonade +50 ; « Maman range ta chambre » ; va ranger ta chambre ; anniversaire (10 de chaque joueur) ; Mamie +100 ; vase de Mamie −100 ; zoo −50 ; garage +25 ; termites (40/cabane, 115/château) ; concours de grimaces +10 ; tirelire +100 ; Père Noël +100 ; bonbons remboursés +20.

Les paquets sont mélangés en début de partie ; une carte piochée retourne sous le paquet (sauf « Maman range ta chambre », gardée par le joueur jusqu'à utilisation).

## Pas assez d'argent, faillite

- Si un humain doit payer plus qu'il n'a, le jeu s'arrête sur **« Tu dois payer… »** : il revend des constructions ou met des endroits en pause (bouton **🪄 Vendre pour moi** pour le faire automatiquement : d'abord les constructions, puis les endroits les moins chers).
- **Faillite 😢** n'est possible que si même en vendant tout on ne peut pas payer. Les endroits vont au joueur à qui on devait de l'argent (ou retournent à la banque, libres à l'achat).
- Les robots et les joueurs qui paient hors de leur tour (anniversaire…) vendent automatiquement.

## Robots

Ils jouent tout seuls avec un petit temps de réflexion. Ils achètent s'il leur reste au moins 120 L$ (ou toujours si ça finit une couleur), construisent en gardant 250 L$ de réserve, réveillent leurs endroits en pause quand ils sont riches, et paient pour sortir de prison en début de partie.

## Conseils d'Ellie et Livia

Une seule fois par partie, au bon moment, pour les joueurs humains : bienvenue, premier achat possible, premier loyer, double, toute une couleur, carte « Maman range ta chambre », prison, manque d'argent. Bouton **❓** : les règles en version enfant.

## Affichage

- **Paysage** (téléphone couché ou ordinateur) : plateau à gauche, panneau à droite. **Portrait** : plateau en haut, panneau en dessous.
- Sur grand écran, les noms et prix s'affichent sur les cases ; sur téléphone, seulement l'emoji (toucher la case pour la carte).
- Menu **⚙️** : vitesse (normale / rapide), nouvelle partie, retour au site. L'écran reste allumé pendant la partie. Installable comme application (Android : menu du navigateur → Installer ; iPhone : Safari → Partager → « Sur l'écran d'accueil »).

## Réglages techniques

- Constantes en haut du script : `START_BONUS`, `JAIL_FINE`, `GROUPS` (couleurs, prix des cabanes), `BOARD` (les 40 cases), `CHANCE`, `SURPRISE`, `PAWNS`, `COLORS`.
- **Renommer une case** : dans `BOARD`, `S('début|fin', emoji, couleur, prix, loyers)` ; la partie après `|` est le nom court affiché sur le plateau. Les indices 8 (Chance) et 4 (Surprise) sont les cartes « Maman range ta chambre » (utilisés pour les remettre dans le paquet).
- Sauvegardes : `monopolili-save` (partie en cours), `monopolili-last` (derniers joueurs et options), `monopolili-prefs` (vitesse).
- **Après chaque modification** : incrémenter `VERSION` dans `monopolili/sw.js` pour que l'app installée se mette à jour, et mettre à jour ce document.
- Le service worker ne supprime que ses propres caches (`monopolili-…`) ; celui de Lili Parc a été corrigé de la même façon (`liliparc-…`) pour que les deux jeux ne s'effacent pas mutuellement.

## Pistes pour la suite

- Enchères quand personne n'achète un endroit.
- Robots plus ou moins malins (niveau de difficulté).
- Sons et petite musique.
- Plateau dessiné à la main façon Lilirobot à la place des emojis.

## Historique des versions

- **v1** — première version : plateau de 40 cases aux noms rigolos, 2 dés et doubles, cartes Chance et Surprise de Lili, cabanes et châteaux, pause (hypothèque), échanges, robots, chambre en désordre, faillite, parties à tours limités, panier du pique-nique, sauvegarde, application hors connexion, conseils d'Ellie et Livia.
- **v2** — nouveau logo de l'application : Ellie et Livia sur un plateau de Monopoly, avec deux dés et une pièce de LiliDollar.
